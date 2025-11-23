cmake_minimum_required(VERSION 3.16)

project(StoryToVideo VERSION 0.1 LANGUAGES CXX)

set(CMAKE_AUTOMOC ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED COMPONENTS Quick)


qt_add_executable(appStoryToVideo
    main.cpp
)

qt_add_qml_module(appStoryToVideo
    URI StoryToVideo
    VERSION 1.0
    QML_FILES
        Main.qml
        QML_FILES Create.qml
        QML_FILES Storyboard.qml
        QML_FILES Navigation.qml
        QML_FILES ShotDetail.qml
        QML_FILES Preview.qml
        QML_FILES Assets.qml
        SOURCES NetworkManager.h
        SOURCES NetworkManager.cpp
)

# Qt for iOS sets MACOSX_BUNDLE_GUI_IDENTIFIER automatically since Qt 6.1.
# If you are developing for iOS or macOS you should consider setting an
# explicit, fixed bundle identifier manually though.
set_target_properties(appStoryToVideo PROPERTIES
#    MACOSX_BUNDLE_GUI_IDENTIFIER com.example.appStoryToVideo
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)

target_link_libraries(appStoryToVideo
    PRIVATE Qt6::Quick
)

include(GNUInstallDirs)
install(TARGETS appStoryToVideo
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
