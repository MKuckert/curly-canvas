@echo off

set SRC_DIR=D:\dev\Canvas
set JAVA=java
set EXTDOC_DIR=E:\dev\ext-doc

java -jar "%EXTDOC_DIR%\ext-doc.jar" -p "%SRC_DIR%\doc.xml" -o "%SRC_DIR%\doc" -t "%SRC_DIR%\doc-template\template.xml" -verbose