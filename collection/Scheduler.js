// Scheduler 最多并发处理两个任务
class Scheduler {
    constructor() {
        this.runTask = 0;
        this.queue = [];
    }
    add(promiseCreator) {
		return new Promise((reslove) => {
			if (this.runTask < 2) {
				this.runTask++;
				return promiseCreator().then(() => {
					this.runTask--;
					this.checkQueueAndRun();
					reslove();
				});
			} else {
				this.queue.push({promiseCreator, reslove});
			}
		});
    }
    checkQueueAndRun() {
        if (this.runTask < 2 && this.queue.length > 0) {
            var task = this.queue.shift();
			this.runTask++;
            task.promiseCreator().then(() => {
				this.runTask--;
                this.checkQueueAndRun();
				task.reslove();
            })
        }
    }
}

var timeout = (time) => new Promise((reslove) => {
    setTimeout(reslove, time);
});

var sceldue = new Scheduler();

var addTask = (time, order) => {
    sceldue.add(() => timeout(time)).then(() => {
        console.log(order);
    })
};

addTask(0, 1);
addTask(0, 2);
addTask(0, 3);

addTask(1000, 2);
addTask(500, 1);
addTask(800, 3);
addTask(1200, 4);
// output: 
// 500ms: 1
// 1000ms: 2
// 1300ms: 3
// 2200ms: 4
