import { UnauthorizedError } from '../utils/errors';
import { AuthService } from '../services/auth.service';
import { prisma } from '../db/index';
import cookie from 'cookie';

/**
 * Middleware function conceptually for API routes / Server Functions.
 * Returns the authenticated user payload, or throws UnauthorizedError.
 */
export async function requireAuth(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = cookie.parse(cookieHeader);
  
  // Also check Authorization header as fallback
  const authHeader = req.headers.get('authorization');
  let token = cookies['accessToken'];

  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('Authentication required');
  }

  const payload = await AuthService.verifyToken(token);
  return payload; // { userId, role }
}

export function requireRole(allowedRoles: string[]) {
  return async (req: Request) => {
    const user = await requireAuth(req);
    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedError(`Access denied. Requires one of: ${allowedRoles.join(', ')}`);
    }
    return user;
  };
}

export function requirePermission(permissionName: string) {
  return async (req: Request) => {
    const payload = await requireAuth(req);
    
    // Check if the user's role has the requested permission
    const role = await prisma.role.findUnique({
      where: { name: payload.role },
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });

    if (!role) {
      throw new UnauthorizedError('Role not found');
    }

    const hasPerm = role.permissions.some(rp => rp.permission.name === permissionName);
    
    // Admin always has permission
    if (!hasPerm && payload.role !== 'ADMIN') {
      throw new UnauthorizedError(`Access denied. Missing permission: ${permissionName}`);
    }

    return payload;
  };
}
