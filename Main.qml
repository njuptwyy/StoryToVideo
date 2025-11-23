
// import QtQuick 2.15
// import QtQuick.Controls 2.15

// ApplicationWindow {
//     id: appWindow
//     visible: true
//     width: 1024
//     height: 768
//     title: "StoryToVideo"

//     StackView {
//         id: stackView
//         anchors.fill: parent
//         initialItem: Navigation {}
//     }
// }

import QtQuick 2.15
import QtQuick.Controls 2.15

ApplicationWindow {
    id: appWindow
    visible: true
    width: 1024
    height: 768
    title: "StoryToVideo"

    // 全局 StackView 引用
    property var globalStackView: stackView

    StackView {
        id: stackView
        anchors.fill: parent
        initialItem: Navigation {}
    }
}
