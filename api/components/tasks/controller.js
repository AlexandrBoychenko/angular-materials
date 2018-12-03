const Factories                                 = use('core/factories');

const TasksFactory                              = Factories('Tasks');

const TasksController = {

    path: TasksFactory.__model__.name,

    permissions: {
        GET: 'Tasks.Read',
        POST: 'Tasks.Create',
        PUT: 'Tasks.Update',
        DELETE: 'Tasks.Delete'
    },

    GET : [
        // tasks
        function (limit = 100, offset = 0) {
            return TasksFactory.find({}, limit, offset);
        },

        // tasks/23
        function (tasksId) {
            return TasksFactory.get({id: tasksId});
        }

    ],

    POST : [
        // tasks
        function () {

            return TasksFactory.new(this.request.body)
                .then((task)=>{
                    this.response.status = this.response.statuses._201_Created;
                    return task.save();
                });
        }

    ],

    PUT : [
        // tasks/1
        function (tasksId) {

            return TasksFactory.get({id: tasksId})
                .then((task)=> {
                    task.addItem(this.request.body);
                    task.populate(this.request.body);
                    return task.save();
                });
        }

    ],

    DELETE : [
        // tasks/15
        function (tasksId) {

            return TasksFactory.get({id: tasksId})
                .then((task) => {
                    return task.remove();
                })
                .then((task) => {
                    if(task.affectedRows){
                        this.response.status = this.response.statuses._204_NoContent;
                    }
                });
        }

    ]
};

module.exports = TasksController;