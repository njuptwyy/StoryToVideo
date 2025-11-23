
// import QtQuick 2.15
// import QtQuick.Controls 2.15

// Page {
//     id: storyboardPage
//     title: "Storyboard"

//     property var projectId: "test_project" // 测试用项目ID
//     property var shotModel: []            // 分镜模型

//     Column {
//         anchors.fill: parent
//         spacing: 10
//         padding: 10

//         Text {
//             text: "Storyboard 页面"
//             font.pixelSize: 24
//             horizontalAlignment: Text.AlignHCenter
//             anchors.horizontalCenter: parent.horizontalCenter
//         }

//         // 分镜卡片列表
//         ListView {
//             id: shotList
//             anchors.horizontalCenter: parent.horizontalCenter
//             height: 220
//             width: parent.width
//             orientation: ListView.Horizontal
//             spacing: 10
//             model: shotModel.length > 0 ? shotModel : [1,2,3] // 如果没有数据先显示占位

//             delegate: Rectangle {
//                 width: 150
//                 height: 200
//                 color: "#dddddd"
//                 border.color: "black"
//                 border.width: 1
//                 radius: 5

//                 Column {
//                     anchors.fill: parent
//                     anchors.margins: 5
//                     spacing: 5

//                     Rectangle {
//                         width: parent.width
//                         height: 100
//                         color: "#bbbbbb"
//                         Text { anchors.centerIn: parent;
//                                text: modelData.imageUrl ? "图片" : "缩略图" }
//                     }

//                     Text { text: modelData.description ? modelData.description : "镜头 " + (index + 1) }
//                     Text { text: "状态: " + (modelData.status ? modelData.status : "pending") }

//                     Button {
//                         text: "详情"
//                         anchors.horizontalCenter: parent.horizontalCenter
//                         onClicked: {
//                             // 测试跳转到 ShotDetail.qml
//                             stackView.push(Qt.resolvedUrl("ShotDetail.qml"))
//                         }
//                     }
//                 }
//             }
//         }

//         // 底部生成视频按钮
//         Button {
//             text: "生成视频"
//             anchors.horizontalCenter: parent.horizontalCenter
//             onClicked: {
//                 videoTimer.start() // 点击启动 Timer 模拟视频生成
//             }
//         }

//         // Timer 模拟异步视频生成
//         Timer {
//             id: videoTimer
//             interval: 2000 // 2秒后触发
//             repeat: false
//             onTriggered: {
//                 stackView.push(Qt.resolvedUrl("Preview.qml"))
//             }
//         }
//     }

//     Component.onCompleted: {
//         // 测试用模拟数据
//         shotModel = [
//             { shotId: 1, description: "小女孩走在森林中", imageUrl: null, status: "pending" },
//             { shotId: 2, description: "小猫探头看雪", imageUrl: null, status: "pending" },
//             { shotId: 3, description: "小猫走到庭院", imageUrl: null, status: "pending" }
//         ]

//         console.log("Storyboard 页面加载完成，模拟数据已生成")

//         // 如果后端准备好了，可以调用接口替换模拟数据：
//         // if (networkManager) networkManager.getStoryboard(projectId)
//     }
// }

import QtQuick 2.15
import QtQuick.Controls 2.15

Page {
    id: storyboardPage
    title: "Storyboard"

    property var projectId: "test_project" // 测试用项目ID
    property var shotModel: []            // 分镜模型

    Column {
        anchors.fill: parent
        spacing: 10
        padding: 10

        Text {
            text: "Storyboard 页面"
            font.pixelSize: 24
            horizontalAlignment: Text.AlignHCenter
            anchors.horizontalCenter: parent.horizontalCenter
        }

        // 分镜卡片列表
        ListView {
            id: shotList
            anchors.horizontalCenter: parent.horizontalCenter
            height: 220
            width: parent.width
            orientation: ListView.Horizontal
            spacing: 10
            model: shotModel.length > 0 ? shotModel : [1,2,3] // 如果没有数据先显示占位

            delegate: Rectangle {
                width: 150
                height: 200
                color: "#dddddd"
                border.color: "black"
                border.width: 1
                radius: 5

                Column {
                    anchors.fill: parent
                    anchors.margins: 5
                    spacing: 5

                    Rectangle {
                        width: parent.width
                        height: 100
                        color: "#bbbbbb"
                        Text { anchors.centerIn: parent;
                               text: modelData.imageUrl ? "图片" : "缩略图" }
                    }

                    Text { text: modelData.description ? modelData.description : "镜头 " + (index + 1) }
                    Text { text: "状态: " + (modelData.status ? modelData.status : "pending") }

                    Button {
                        text: "详情"
                        anchors.horizontalCenter: parent.horizontalCenter
                        onClicked: {
                            stackView.push(Qt.resolvedUrl("ShotDetail.qml"))
                        }
                    }
                }
            }
        }

        // 底部生成视频按钮
        Button {
            text: "生成视频"
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: {
                if(networkManager) {
                    console.log("调用 NetworkManager.generateVideo:", projectId)
                    networkManager.generateVideo(projectId)
                } else {
                    console.log("networkManager 未定义，使用 Timer 模拟")
                    videoTimer.start()
                }
            }
        }

        // 测试跳转Preview页面按钮
        Button {
            text: "测试跳转Preview页面"
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: {
                console.log("测试跳转Preview页面")
                stackView.push(Qt.resolvedUrl("Preview.qml"))
            }
        }

        // Timer 模拟异步视频生成
        Timer {
            id: videoTimer
            interval: 2000 // 2秒后触发
            repeat: false
            onTriggered: {
                stackView.push(Qt.resolvedUrl("Preview.qml"))
            }
        }
    }

    Component.onCompleted: {
        // 测试用模拟数据
        shotModel = [
            { shotId: 1, description: "小女孩走在森林中", imageUrl: null, status: "pending" },
            { shotId: 2, description: "小猫探头看雪", imageUrl: null, status: "pending" },
            { shotId: 3, description: "小猫走到庭院", imageUrl: null, status: "pending" }
        ]

        console.log("Storyboard 页面加载完成，模拟数据已生成")

        if(networkManager) networkManager.getStoryboard(projectId)
    }

    // 监听视频任务信号
    Connections {
        target: networkManager
        function onVideoTaskStarted(taskId) {
            console.log("视频任务启动，taskId:", taskId)
        }
        function onVideoReady(videoUrl) {
            console.log("视频生成完成，videoUrl:", videoUrl)
            stackView.push(Qt.resolvedUrl("Preview.qml"))
        }
    }
}

