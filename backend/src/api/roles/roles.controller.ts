import { Request, Response } from 'express';

interface Role {
  id: string;
  organisationId: string;
  name: string;
  description: string;
  requirements: string[];
  createdAt: Date;
}

const roles: Role[] = [];

export class RolesController {
  static async createRole(req: Request, res: Response) {
    try {
      const { organisationId, name, description, requirements } = req.body;

      if (!organisationId || !name) {
        return res.status(400).json({ error: 'organisationId and name required' });
      }

      const role: Role = {
        id: Date.now().toString(),
        organisationId,
        name,
        description,
        requirements: requirements || [],
        createdAt: new Date(),
      };

      roles.push(role);

      return res.status(201).json(role);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create role' });
    }
  }

  static async getRoles(req: Request, res: Response) {
    try {
      const { organisationId } = req.query;

      if (!organisationId) {
        return res.status(400).json({ error: 'organisationId required' });
      }

      const orgRoles = roles.filter(r => r.organisationId === organisationId);
      return res.json(orgRoles);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch roles' });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, requirements } = req.body;

      const role = roles.find(r => r.id === id);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      if (name) role.name = name;
      if (description) role.description = description;
      if (requirements) role.requirements = requirements;

      return res.json(role);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update role' });
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const index = roles.findIndex(r => r.id === id);

      if (index === -1) {
        return res.status(404).json({ error: 'Role not found' });
      }

      roles.splice(index, 1);
      return res.json({ message: 'Role deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete role' });
    }
  }
}