/*
#include <QGuiApplication>
#include <QQmlApplicationEngine>

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;
    const QUrl url(QStringLiteral("qrc:/StoryToVideo/Main.qml"));
    QObject::connect(
        &engine,
        &QQmlApplicationEngine::objectCreated,
        &app,
        [url](QObject *obj, const QUrl &objUrl) {
            if (!obj && url == objUrl)
                QCoreApplication::exit(-1);
        },
        Qt::QueuedConnection);
    engine.load(url);

    return app.exec();
}
*/

// #include <QGuiApplication>
// #include <QQmlApplicationEngine>
// #include <QQmlContext>
// #include "NetworkManager.h"

// int main(int argc, char *argv[])
// {
//     QGuiApplication app(argc, argv);

//     QQmlApplicationEngine engine;

//     // 注册 NetworkManager 给 QML
//     NetworkManager networkManager;
//     engine.rootContext()->setContextProperty("Net", &networkManager);

//     // QML 文件路径（保持原来的 qrc prefix）
//     const QUrl url(QStringLiteral("qrc:/StoryToVideo/Main.qml"));

//     QObject::connect(
//         &engine, &QQmlApplicationEngine::objectCreated,
//         &app,
//         [url](QObject *obj, const QUrl &objUrl) {
//             if (!obj && url == objUrl)
//                 QCoreApplication::exit(-1);
//         },
//         Qt::QueuedConnection
//         );

//     engine.load(url);

//     return app.exec();
// }
#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include "NetworkManager.h"

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;

    // 注册 NetworkManager
    NetworkManager* networkManager = new NetworkManager(&app);
    engine.rootContext()->setContextProperty("networkManager", networkManager);

    // 直接用本地路径加载 QML，不用 qrc
    const QUrl url = QUrl::fromLocalFile("D:/StoryToVideo/StoryToVideo/Main.qml");

    QObject::connect(
        &engine,
        &QQmlApplicationEngine::objectCreated,
        &app,
        [url](QObject *obj, const QUrl &objUrl) {
            if (!obj && url == objUrl)
                QCoreApplication::exit(-1);
        },
        Qt::QueuedConnection);

    engine.load(url);

    return app.exec();
}


