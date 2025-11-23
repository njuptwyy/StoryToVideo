// NetworkManager.h
#pragma once


#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QJsonObject>
#include <QJsonDocument>


class NetworkManager : public QObject {
    Q_OBJECT
public:
    explicit NetworkManager(QObject* parent = nullptr);
    ~NetworkManager();


    // API methods (exposed to QML)
    Q_INVOKABLE void createStory(const QString &text, const QString &style);
    Q_INVOKABLE void getStoryboard(const QString &projectId);
    Q_INVOKABLE void updateShot(int shotId, const QString &prompt, const QString &narration, const QString &transition);
    Q_INVOKABLE void generateImage(int shotId, const QString &prompt);
    Q_INVOKABLE void generateVideo(const QString &projectId);
    Q_INVOKABLE void queryVideoStatus(const QString &projectId);
    Q_INVOKABLE void getVideo(const QString &projectId);
    Q_INVOKABLE void getAssetsList();
    Q_INVOKABLE void deleteProject(const QString &projectId);


signals:
    // Signals emit JSON strings (QML can JSON.parse them)
    void storyCreated(QString jsonString);
    void storyboardLoaded(QString jsonString);
    void shotUpdated(bool success, QString message);
    void imageGenerated(QString jsonString);
    void videoTaskStarted(QString taskId);
    void videoStatus(QString jsonString);
    void videoReady(QString videoUrl);
    void assetsListLoaded(QString jsonString);
    void projectDeleted(bool success, QString message);
    void requestFailed(QString error);


private slots:
    void onReplyFinished();


private:
    QNetworkAccessManager* m_manager;
    QString baseUrl();


    // helper
    void postJson(const QString &path, const QJsonObject &payload, const QString &contextTag = QString());
    void get(const QString &path, const QString &contextTag = QString());
    void del(const QString &path, const QString &contextTag = QString());
};
