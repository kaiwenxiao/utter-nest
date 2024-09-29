import { PoliciesHandler } from '@lib/casl/policy.interface';
import { SetMetadata } from '@nestjs/common';
import { CHECK_POLICIES_KEY_META } from '@common/constant/metadata.constants';

export function CheckPolicies(...handlers: PoliciesHandler[]) {
  return SetMetadata(CHECK_POLICIES_KEY_META, handlers);
}