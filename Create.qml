// import QtQuick 2.15
// import QtQuick.Controls 2.15

// Page {
//     id: createPage

//     Column {
//         anchors.centerIn: parent
//         spacing: 10

//         TextArea {
//             id: storyText
//             width: 400
//             height: 100
//             placeholderText: "在此输入故事文本..."
//         }

//         ComboBox {
//             id: styleCombo
//             width: 200
//             model: ["cinematic", "anime", "realistic"]
//         }

//         Button {
//             text: "生成故事"
//             onClicked: {
//                 console.log("调用 NetworkManager.createStory:", storyText.text, styleCombo.currentText)
//                 // 调用封装 API
//                 networkManager.createStory(storyText.text, styleCombo.currentText)
//             }
//         }
//     }

//     // Timer 可以保留用于模拟延迟，也可以删掉
//     Timer {
//         id: timerGenerateStory
//         interval: 1000
//         running: false
//         repeat: false
//         onTriggered: {
//             console.log("跳转 Storyboard 页面")
//             appWindow.globalStackView.push(Qt.resolvedUrl("Storyboard.qml"))
//         }
//     }

//     // 捕获 NetworkManager 返回信号
//     Connections {
//         target: networkManager
//         onStoryCreated: {
//             console.log("storyCreated 返回:", jsonString)
//             // 这里可以更新本地数据模型（shotModel 等），然后跳转
//             timerGenerateStory.start()
//         }

//         onRequestFailed: {
//             console.log("请求失败:", error)
//         }
//     }
// }
import QtQuick 2.15
import QtQuick.Controls 2.15

Page {
    id: createPage

    Column {
        anchors.centerIn: parent
        spacing: 10

        TextArea { id: storyText; width: 400; height: 100 }
        ComboBox { id: styleCombo; width: 200; model: ["cinematic","anime","realistic"] }

        Button {
            text: "生成故事"
            onClicked: {
                console.log("调用 NetworkManager.createStory:", storyText.text, styleCombo.currentText)
                networkManager.createStory(storyText.text, styleCombo.currentText)
            }
        }

        // 测试用按钮：直接跳转 Storyboard 页面
        Button {
            text: "测试跳转到 Storyboard"
            onClicked: {
                console.log("测试跳转按钮点击")
                appWindow.globalStackView.push(Qt.resolvedUrl("Storyboard.qml"))
            }
        }
    }
}
