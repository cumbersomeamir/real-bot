const prisma = require('../config/database');
const { success, failure } = require('../utils/response');

async function list(req, res) {
  const items = await prisma.project.findMany({ where: { organizationId: req.user.organizationId } });
  return res.json(success({ items }));
}

async function getById(req, res) {
  const project = await prisma.project.findUnique({ where: { id: req.params.id }, include: { inventory: true } });
  if (!project) return res.status(404).json(failure('NOT_FOUND', 'Project not found'));
  return res.json(success(project));
}

async function create(req, res) {
  const project = await prisma.project.create({ data: { ...req.body, organizationId: req.user.organizationId } });
  return res.status(201).json(success(project, 'Project created'));
}

async function update(req, res) {
  const project = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
  return res.json(success(project, 'Project updated'));
}

async function inventory(req, res) {
  const items = await prisma.inventory.findMany({ where: { projectId: req.params.id } });
  return res.json(success({ items }));
}

async function updateInventory(req, res) {
  const item = await prisma.inventory.update({ where: { id: req.params.unitId }, data: req.body });
  return res.json(success(item, 'Inventory updated'));
}

module.exports = {
  list,
  getById,
  create,
  update,
  inventory,
  updateInventory
};
