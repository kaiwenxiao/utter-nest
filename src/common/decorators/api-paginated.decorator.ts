import { ApiExtraModels, ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { CursorPaginationResponse } from '@common/@types/classes/cursor.response';
import { OffsetPaginationResponse } from '@common/@types/classes/offset.response';
import { applyDecorators, Type } from '@nestjs/common';

// todo
export function ApiPaginatedResponse<TModel extends Type>(model: TModel) {
  return applyDecorators(
    ApiOperation({ summary: `${model.name.toLowerCase()} list` }),
    ApiExtraModels(CursorPaginationResponse, OffsetPaginationResponse, model),
    ApiOkResponse({
      description: `Successfully received ${model.name.toLowerCase()} list`,
      schema: {
        oneOf: [
          {
            allOf: [
              { $ref: getSchemaPath(CursorPaginationResponse) },
              {
                properties: {
                  data: {
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            ],
          },
          {
            allOf: [
              { $ref: getSchemaPath(OffsetPaginationResponse) },
              {
                properties: {
                  data: {
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            ],
          },
        ],
      },
    }),
  );
}