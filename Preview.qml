import QtQuick 2.15
import QtQuick.Controls 2.15

Page {
    id: previewPage
    title: "Preview"

    Column {
        anchors.fill: parent
        spacing: 10
        padding: 10

        Text {
            text: "Preview 页面";
            font.pixelSize: 24
            horizontalAlignment: Text.AlignHCenter
            anchors.horizontalCenter: parent.horizontalCenter
        }

        // 视频占位
        Rectangle {
            width: parent.width * 0.8
            height: 300
            color: "#cccccc"
            anchors.horizontalCenter: parent.horizontalCenter
            Text { anchors.centerIn: parent; text: "视频占位" }
        }

        // 播放控制条
        Row {
            spacing: 10
            anchors.horizontalCenter: parent.horizontalCenter
            Button { text: "Play" }
            Button { text: "Pause" }
            Slider { width: 200 }
            Button { text: "Export Video" }
        }

        // 返回导航页按钮
        Button {
            text: "返回导航页"
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: {
                // 用 replace 替换当前页面为 Navigation
                stackView.replace(Qt.resolvedUrl("Navigation.qml"))
            }
        }

    }
}
