```sh
 docker build -t sd-turbo-laptop .
 docker run -d --gpus all -p 8000:8000 -v D:\hf_cache:/root/.cache/huggingface --name sd-turbo-runner sd-turbo-laptop //下载模型
 docker logs -f sd-turbo-runner
```

 ```powershell
 # 定义请求体
$body = @{
    prompt = "A cinematic shot of a cyberpunk street, neon lights, night, rain, 8k, realistic, highly detailed"
    steps = 2  # Turbo 推荐 1-4 步
    seed = 42  # 固定种子以便复现
} | ConvertTo-Json

# 发送 POST 请求
Write-Host "正在发送生成请求..."
$timer = [System.Diagnostics.Stopwatch]::StartNew()

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/generate" -Method Post -ContentType "application/json" -Body $body
    $timer.Stop()
    
    # 检查结果
    if ($response.status -eq "success") {
        # 保存图片
        $bytes = [Convert]::FromBase64String($response.image_base64)
        [IO.File]::WriteAllBytes("$PWD\test_result.png", $bytes)
        
        Write-Host "✅ 成功！图片已保存为: $PWD\test_result.png"
        Write-Host "⏱️ 接口耗时: $($timer.Elapsed.TotalMilliseconds) ms"
    } else {
        Write-Host "❌ 接口返回错误状态"
    }
} catch {
    Write-Host "❌ 请求失败: $_"
}
 ```