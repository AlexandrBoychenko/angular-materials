const Repositories           = use('core/repositories');

const TasksRepository = Repositories.create('tasks');

module.exports = TasksRepository;