// import QtQuick 2.15
// import QtQuick.Controls 2.15

// Page {
//     id: assetsPage

//     Column {
//         anchors.fill: parent
//         spacing: 10
//         padding: 10

//         Text { text: "Assets 页面"; font.pixelSize: 24 }

//         GridView {
//             id: assetsGrid
//             cellWidth: 200
//             cellHeight: 200
//             model: 6 // TODO: 改为 NetworkManager 获取资产列表
//             delegate: Rectangle {
//                 width: 180
//                 height: 180
//                 color: "#dddddd"
//                 border.width: 1
//                 radius: 5
//                 Column {
//                     anchors.fill: parent
//                     anchors.margins: 5
//                     spacing: 5
//                     Rectangle { width: parent.width; height: 100; color: "#bbbbbb"; Text { anchors.centerIn: parent; text: "缩略图" } }
//                     Text { text: "项目名称" }
//                     Text { text: "2025-11-22" }

//                     Row {
//                         spacing: 5
//                         Button { text: "Open"; onClicked: stackView.push(Qt.resolvedUrl("Storyboard.qml")) }
//                         Button { text: "Delete" }
//                     }
//                 }
//             }
//         }

//         Button { text: "+ 创建新项目"; onClicked: stackView.push(Qt.resolvedUrl("Create.qml")) }
//     }
// }
import QtQuick 2.15
import QtQuick.Controls 2.15

Page {
    id: assetsPage
    title: "Assets"

    property var assetsData: [
        { projectId: "p1", title: "森林探险故事", thumbUrl: "", createdAt: "2025-11-22" },
        { projectId: "p2", title: "海边冒险", thumbUrl: "", createdAt: "2025-11-21" },
        { projectId: "p3", title: "城市奇遇", thumbUrl: "", createdAt: "2025-11-20" }
    ]

    Column {
        anchors.fill: parent
        spacing: 10
        padding: 10

        Text {
            text: "Assets 页面"
            font.pixelSize: 24
            horizontalAlignment: Text.AlignHCenter
            anchors.horizontalCenter: parent.horizontalCenter
        }

        GridView {
            id: assetsGrid
            anchors.horizontalCenter: parent.horizontalCenter
            width: parent.width
            height: 400
            cellWidth: 200
            cellHeight: 200
            model: assetsData

            delegate: Rectangle {
                width: 180
                height: 180
                color: "#dddddd"
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
                        Text { anchors.centerIn: parent; text: "缩略图" }
                    }

                    Text { text: modelData.title }
                    Text { text: modelData.createdAt }

                    Row {
                        spacing: 5
                        Button {
                            text: "Open"
                            onClicked: {
                                console.log("打开项目", modelData.projectId)
                                stackView.push(Qt.resolvedUrl("Storyboard.qml"))
                            }
                        }
                        Button {
                            text: "Delete"
                            onClicked: {
                                console.log("删除项目", modelData.projectId)
                                networkManager.deleteProject(modelData.projectId)
                            }
                        }
                    }
                }
            }
        }

        Button {
            text: "+ 创建新项目"
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: stackView.push(Qt.resolvedUrl("Create.qml"))
        }
    }

    // 连接 NetworkManager 删除项目信号
    Connections {
        target: networkManager
        function onProjectDeleted(success, message) {
            if(success) {
                console.log("删除成功")
                // 测试：从 assetsData 中移除
                assetsData = assetsData.filter(function(item){ return item.projectId !== message })
            } else {
                console.log("删除失败:", message)
            }
        }
    }
}
