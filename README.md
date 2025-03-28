# 发布热更新

```bash

code-push release-react quick_app-android android \
  --targetBinaryVersion 1.0.7 \
  --deploymentName Production \
  --description "通过 release-rdd222desssass344"
  --mandatory true
```

- targetBinaryVersion 需与 build.gradle 中的 versionCode 一致
- --mandatory true 表示强制更新

# 图标查看

https://oblador.github.io/react-native-vector-icons/
