@echo off

cd ..

SET PATH=%PATH%;./node_modules/.bin/

tree-sitter generate
