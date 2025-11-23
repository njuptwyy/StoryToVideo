import QtQuick 2.15
import QtQuick.Controls 2.15

Page {
    id: navPage

    Column {
        anchors.centerIn: parent
        spacing: 20

        Button {
            text: "Create 新建故事"
            onClicked: stackView.push(Qt.resolvedUrl("Create.qml"))
        }

        Button {
            text: "Assets 资产库"
            onClicked: stackView.push(Qt.resolvedUrl("Assets.qml"))
        }
    }
}
