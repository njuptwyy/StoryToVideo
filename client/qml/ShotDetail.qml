// import QtQuick 2.15
// import QtQuick.Controls 2.15

// Page {
//     id: shotDetailPage

//     Column {
//         anchors.fill: parent
//         spacing: 10
//         padding: 10

//         Text { text: "Shot Detail 页面"; font.pixelSize: 24 }

//         TextArea { id: promptArea; placeholderText: "Prompt..." }
//         TextArea { id: narrationArea; placeholderText: "Narration..." }

//         ComboBox {
//             id: transitionCombo
//             model: ["Crossfade", "Ken Burns", "Volume Mix"]
//         }

//         Button {
//             text: "Generate Image"
//             onClicked: {
//                 // TODO: 调用 NetworkManager.generateImage()
//             }
//         }

//         Rectangle {
//             width: parent.width * 0.8
//             height: 200
//             color: "#eeeeee"
//             Text { anchors.centerIn: parent; text: "生成图片占位" }
//         }

//         Button {
//             text: "返回分镜页"
//             onClicked: stackView.pop()
//         }
//     }
// }
import QtQuick 2.15
import QtQuick.Controls 2.15

Page {
    id: shotDetailPage

    // 用 QtObject 作为数据容器，存储当前镜头信息
    property QtObject shotData: QtObject {
        property string prompt: "默认Prompt"
        property string narration: "默认旁白"
        property string transition: "Crossfade"
    }

    Column {
        anchors.fill: parent
        spacing: 10
        padding: 10

        Text {
            text: "Shot Detail 页面";
            font.pixelSize: 24
            horizontalAlignment: Text.AlignHCenter
            anchors.horizontalCenter: parent.horizontalCenter
        }

        TextArea {
            id: promptArea;
            placeholderText: "Prompt..."
            text: shotData.prompt
            width: parent.width * 0.8
            height: 80
        }

        TextArea {
            id: narrationArea;
            placeholderText: "Narration..."
            text: shotData.narration
            width: parent.width * 0.8
            height: 80
        }

        ComboBox {
            id: transitionCombo
            model: ["Crossfade", "Ken Burns", "Volume Mix"]
            currentIndex: transitionCombo.model.indexOf(shotData.transition)
            width: 200
        }

        Button {
            text: "保存并更新镜头"
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: {
                console.log("调用 NetworkManager.updateShot:", shotData.prompt, shotData.narration, shotData.transition)
                networkManager.updateShot(1, promptArea.text, narrationArea.text, transitionCombo.currentText)

                // 更新本地 shotData（模拟）
                shotData.prompt = promptArea.text
                shotData.narration = narrationArea.text
                shotData.transition = transitionCombo.currentText
            }
        }

        Button {
            text: "Generate Image"
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: {
                console.log("调用 NetworkManager.generateImage")
                networkManager.generateImage(1, promptArea.text)
            }
        }

        Rectangle {
            width: parent.width * 0.8
            height: 200
            color: "#eeeeee"
            anchors.horizontalCenter: parent.horizontalCenter
            Text { anchors.centerIn: parent; text: "生成图片占位" }
        }

        Button {
            text: "返回分镜页"
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: {
                appWindow.globalStackView.pop()
            }
        }

        // 测试跳转到 Preview 页
        Button {
            text: "测试跳转到 Preview"
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: {
                appWindow.globalStackView.push(Qt.resolvedUrl("Preview.qml"))
            }
        }
    }
}

