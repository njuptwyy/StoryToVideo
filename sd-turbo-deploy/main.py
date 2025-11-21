from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from diffusers import AutoPipelineForText2Image
import base64
from io import BytesIO
from contextlib import asynccontextmanager

# 全局变量存储模型
pipe = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipe
    print("正在加载 SDXL Turbo 模型...")
    try:
        # 1. 加载模型 (fp16)
        pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo",
            torch_dtype=torch.float16,
            variant="fp16"
        )
        
        if torch.cuda.is_available():
            # 2. 【关键修改】针对 8GB 显存优化
            # 不要使用 pipe.to("cuda")，改用 offload
            # 这会将不活动的组件卸载到 RAM，大幅降低 VRAM 占用，速度略微下降但很稳
            pipe.enable_model_cpu_offload()
            
            # 如果 offload 仍然 OOM (极少情况)，可以用 sequential offload (更慢但更省)
            # pipe.enable_sequential_cpu_offload()
            
            # vae 切片，进一步节省显存
            pipe.enable_vae_slicing()
        else:
            print("警告: 未检测到 GPU")
            
        print("模型加载完成！")
        yield
    finally:
        del pipe
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

app = FastAPI(lifespan=lifespan)

# 定义请求数据结构
class GenerateRequest(BaseModel):
    prompt: str
    steps: int = 1
    seed: int = -1

@app.post("/generate")
async def generate_image(req: GenerateRequest):
    global pipe
    if pipe is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # 处理随机种子
    generator = None
    if req.seed != -1:
        generator = torch.Generator("cuda").manual_seed(req.seed)

    try:
        # 推理
        image = pipe(
            prompt=req.prompt,
            num_inference_steps=req.steps,
            guidance_scale=0.0, # Turbo 必须为 0
            generator=generator
        ).images[0]

        # 转为 Base64 返回
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {"status": "success", "image_base64": img_str}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "gpu": torch.cuda.is_available()}