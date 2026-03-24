# Exception

这个目录用于统一管理服务端接口异常。

## 目标

- 统一接口错误返回格式
- 统一常见 HTTP 状态码语义
- 避免在业务代码里直接手写状态码

当前接口错误响应格式为：

```json
{
  "code": 400,
  "msg": "Bad Request"
}
```

默认情况下：

- 普通 `Error` 会被全局错误处理器兜底为 `500`
- 只有继承 `HttpException` 的自定义异常，才会返回自定义的 `code` 和 `msg`

## 基类

### `HttpException`

文件：[HttpException.ts](/Users/yanyu/workspace/gitea/antdv-next/admin/server/common/exception/HttpException.ts)

基础异常类，所有业务异常都应该继承它。

```ts
throw new HttpException(400, '参数错误');
```

说明：

- 第一个参数是 HTTP 状态码
- 第二个参数是返回给前端的提示信息
- 状态码只允许 `400-599`，非法值会自动回退到 `500`

## 预置异常

文件：[index.ts](/Users/yanyu/workspace/gitea/antdv-next/admin/server/common/exception/index.ts)

目前提供了这些异常：

- `BadRequestException`: `400`，参数错误、请求数据不合法
- `UnauthorizedException`: `401`，未登录、token 失效、登录过期
- `ForbiddenException`: `403`，已登录但没有权限
- `NotFoundException`: `404`，资源不存在
- `ConflictException`: `409`，资源冲突、重复操作
- `UnprocessableEntityException`: `422`，请求格式正确但业务校验失败
- `TooManyRequestsException`: `429`，请求过于频繁、被限流
- `InternalServerException`: `500`，明确需要抛出服务端异常时使用

## 使用方式

推荐从统一出口导入：

```ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '../../common/exception';
```

示例：

```ts
if (!token) {
  throw new UnauthorizedException('请先登录');
}

if (!user) {
  throw new NotFoundException('用户不存在');
}

if (isDuplicateName) {
  throw new ConflictException('名称已存在');
}
```

## 选择建议

- 参数缺失、类型错误、格式错误：`BadRequestException`
- 未登录、token 无效：`UnauthorizedException`
- 没有操作权限：`ForbiddenException`
- 数据不存在：`NotFoundException`
- 重名、重复提交、状态冲突：`ConflictException`
- 表单校验、业务规则校验不通过：`UnprocessableEntityException`
- 未知错误：直接抛普通 `Error`，由全局处理器返回 `500`

## 不推荐的写法

不建议在业务代码里直接写：

```ts
throw new HttpException(403, 'Forbidden');
throw new HttpException(404, 'Not Found');
```

更推荐：

```ts
throw new ForbiddenException('没有权限');
throw new NotFoundException('资源不存在');
```

这样代码语义更清晰，也便于后续统一维护。
