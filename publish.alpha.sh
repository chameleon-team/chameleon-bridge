#!/bin/bash
set -e

<<COMMENT
    发布前注意先在package.json中更新好版本号，这里不做自动更新
COMMENT

# 根目录临时目录名，用完删掉
NPM_PUBLISH_DIR='.npm_publish'
NPM_PUBLISH_DIR_SRC='src/bridge/.'

if [ -e ./${NPM_PUBLISH_DIR} ]; then
rm -rf ${NPM_PUBLISH_DIR}
echo "临时文件夹存在，已删除"
fi

# 创建临时文件夹
mkdir ${NPM_PUBLISH_DIR}

# 拷贝到根目录临时目录处
cp package.json ${NPM_PUBLISH_DIR}
cp -rf ${NPM_PUBLISH_DIR_SRC} ${NPM_PUBLISH_DIR}
cd ${NPM_PUBLISH_DIR}

# 发布
VERSION=`cat package.json | grep version | awk -F: '{print $2}' | sed s/[\",\ ]//g`
TAG_REVERSE=`cat package.json | grep version | awk -F: '{print $2}' | sed s/[\",\ ]//g | awk -F- '{print $2"-"$1}'`
echo "package.json版本号${VERSION}，alpha会进行反转为${TAG_REVERSE}"
read -p "确定要发布吗？[Y/y]" -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
npm publish --tag ${TAG_REVERSE}
echo "\033[36m发布完毕\033[0m" 
else
echo "tag无效"
fi

# 用完删掉临时目录
cd ../
rm -rf ${NPM_PUBLISH_DIR}