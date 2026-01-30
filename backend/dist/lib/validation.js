import { z } from 'zod';
export function zodErrorToMessage(err) {
    return err.issues.map((i) => `${i.path.join('.') || 'field'}: ${i.message}`).join('; ');
}
//# sourceMappingURL=validation.js.map