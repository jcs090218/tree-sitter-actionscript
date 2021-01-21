@echo off

cd ..

SET PATH=%PATH%;./node_modules/.bin/

tree-sitter generate

tree-sitter parse ./example-file
