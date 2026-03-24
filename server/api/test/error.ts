import { defineHandler } from 'nitro/h3';

import { BadRequestException } from '../../common/exception';

export default defineHandler(() => {
  throw new BadRequestException();
});
