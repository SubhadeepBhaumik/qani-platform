import { Request, Response } from 'express';

interface Requirement {
  id: string;
  roleId: string;
  category: string;
  name: string;
  mandatory: boolean;
  weight: number;
  createdAt: Date;
}

const requirements: Requirement[] = [];

export class RequirementsController {
  static async createRequirement(req: Request, res: Response) {
    try {
      const { roleId, category, name, mandatory, weight } = req.body;

      if (!roleId || !category || !name) {
        return res.status(400).json({ error: 'roleId, category, name required' });
      }

      const requirement: Requirement = {
        id: Date.now().toString(),
        roleId,
        category,
        name,
        mandatory: mandatory || false,
        weight: weight || 1,
        createdAt: new Date(),
      };

      requirements.push(requirement);
      return res.status(201).json(requirement);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create requirement' });
    }
  }

  static async getRequirements(req: Request, res: Response) {
    try {
      const { roleId } = req.query;

      if (!roleId) {
        return res.status(400).json({ error: 'roleId required' });
      }

      const roleReqs = requirements.filter(r => r.roleId === roleId);
      return res.json(roleReqs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch requirements' });
    }
  }

  static async updateRequirement(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, mandatory, weight } = req.body;

      const req_obj = requirements.find(r => r.id === id);
      if (!req_obj) {
        return res.status(404).json({ error: 'Requirement not found' });
      }

      if (name) req_obj.name = name;
      if (mandatory !== undefined) req_obj.mandatory = mandatory;
      if (weight) req_obj.weight = weight;

      return res.json(req_obj);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update requirement' });
    }
  }

  static async deleteRequirement(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const index = requirements.findIndex(r => r.id === id);

      if (index === -1) {
        return res.status(404).json({ error: 'Requirement not found' });
      }

      requirements.splice(index, 1);
      return res.json({ message: 'Requirement deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete requirement' });
    }
  }
}