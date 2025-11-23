#include "NetworkManager.h"
#include <QNetworkRequest>
#include <QJsonDocument>
#include <QUrl>
#include <QDebug>

NetworkManager::NetworkManager(QObject* parent)
    : QObject(parent), m_manager(new QNetworkAccessManager(this))
{
    connect(m_manager, &QNetworkAccessManager::finished, this, &NetworkManager::onReplyFinished);
}

NetworkManager::~NetworkManager() {}

// Base URL
QString NetworkManager::baseUrl()
{
    return QStringLiteral("http://localhost:8000"); // 可改成后端地址
}

// Helper methods
void NetworkManager::postJson(const QString &path, const QJsonObject &payload, const QString &contextTag)
{
    QUrl url(baseUrl() + path);
    QNetworkRequest req(url);
    req.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    QByteArray body = QJsonDocument(payload).toJson(QJsonDocument::Compact);
    QNetworkReply* reply = m_manager->post(req, body);
    reply->setProperty("contextTag", contextTag);
}

void NetworkManager::get(const QString &path, const QString &contextTag)
{
    QUrl url(baseUrl() + path);
    QNetworkRequest req(url);
    QNetworkReply* reply = m_manager->get(req);
    reply->setProperty("contextTag", contextTag);
}

void NetworkManager::del(const QString &path, const QString &contextTag)
{
    QUrl url(baseUrl() + path);
    QNetworkRequest req(url);
    QNetworkReply* reply = m_manager->deleteResource(req);
    reply->setProperty("contextTag", contextTag);
}

// Slots
void NetworkManager::onReplyFinished()
{
    QNetworkReply* reply = qobject_cast<QNetworkReply*>(sender());
    if (!reply) return;
    QString tag = reply->property("contextTag").toString();
    qDebug() << "Reply finished for tag:" << tag;
    reply->deleteLater();
}

// Q_INVOKABLE methods

void NetworkManager::createStory(const QString &text, const QString &style)
{
    qDebug() << "createStory called:" << text << style;
}

void NetworkManager::getStoryboard(const QString &projectId)
{
    qDebug() << "getStoryboard called:" << projectId;
}

void NetworkManager::updateShot(int shotId, const QString &prompt, const QString &narration, const QString &transition)
{
    qDebug() << "updateShot called:" << shotId << prompt << narration << transition;
}

void NetworkManager::generateImage(int shotId, const QString &prompt)
{
    qDebug() << "generateImage called:" << shotId << prompt;
}

void NetworkManager::generateVideo(const QString &projectId)
{
    qDebug() << "generateVideo called:" << projectId;
}

void NetworkManager::queryVideoStatus(const QString &projectId)
{
    qDebug() << "queryVideoStatus called:" << projectId;
}

void NetworkManager::getVideo(const QString &projectId)
{
    qDebug() << "getVideo called:" << projectId;
}

void NetworkManager::getAssetsList()
{
    qDebug() << "getAssetsList called";
}

void NetworkManager::deleteProject(const QString &projectId)
{
    qDebug() << "deleteProject called:" << projectId;
}
