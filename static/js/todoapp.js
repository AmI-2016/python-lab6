$(document).ready(function() {
    addTask();
    filterTasks();
	loadAndShowTasks();
});


function filterTasks() {
    $("#filter-tasks").submit(function (event) {

        var search_substring = $('input[name=search_substring]').val();

        // get the table
        var table = $("#task-list");

        // create a clone of table, temporary and empty
        var tmpTable = table.clone().empty();

        // get all the tasks from the REST server
        $.get("api/v1.0/tasks?search_substring="+search_substring, function(data) {

            // populate it!
            for ( var i in data.tasks) {
                var tr = document.createElement("tr");

                var task = document.createElement("td");
                task.textContent = data.tasks[i].description;
                tr.appendChild(task);

                var urgent = document.createElement("td");
                urgent.textContent = data.tasks[i].urgent;
                tr.appendChild(urgent);

                var buttonDiv = document.createElement("div");
                buttonDiv.className = "button-container";
                var button = document.createElement("button");
                button.innerHTML = "update";
                button.setAttribute("data-toggle", "modal");
                button.setAttribute("data-target", "#myModal");
                button.setAttribute("onclick","set_values_for_update("+data.tasks[i].id+",\""+data.tasks[i].description+"\","+data.tasks[i].urgent+");")
                buttonDiv.appendChild(button);
                tr.appendChild(buttonDiv);


                var buttonDeleteDiv = document.createElement("div");
                buttonDeleteDiv.className = "button-container";
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "delete";
                deleteButton.setAttribute("onclick","delete_task("+data.tasks[i].id+");")
                buttonDeleteDiv.appendChild(deleteButton);
                tr.appendChild(buttonDeleteDiv);
                tmpTable.append(tr);

            }

            // replace table with its (updated) clone
            table.replaceWith(tmpTable);
        });

        // stop the form from submitting the normal way
        event.preventDefault();
    });
}

function addTask() {
    $("#add-task").submit(function (event) {

        var description = $('input[name=description]').val();
        var urgent = $('input[name=urgent]').prop('checked');

        if(urgent)
            urgent = 1;
        else
            urgent = 0;

        // process the form
        $.ajax({
            url : '/api/v1.0/tasks',
            type : 'POST',
            data : '{ "description": "' + description + '", "urgent": ' + urgent + ' }',
            contentType : 'application/json',
            success: function () {
                // reset the form
                document.getElementById("add-task").reset();
                // update the task list
                loadAndShowTasks();
            }
        });

        // stop the form from submitting the normal way
        event.preventDefault();

    });
}

function loadAndShowTasks() {

    //reset the filter form
    document.getElementById("filter-tasks").reset();

    // get the table
    var table = $("#task-list");

    // create a clone of table, temporary and empty
    var tmpTable = table.clone().empty();

    // get all the tasks from the REST server
    $.get("api/v1.0/tasks", function(data) {

        // populate it!
        for ( var i in data.tasks) {
            var tr = document.createElement("tr");

            var task = document.createElement("td");
            task.textContent = data.tasks[i].description;
            tr.appendChild(task);

            var urgent = document.createElement("td");
            urgent.textContent = data.tasks[i].urgent;
            tr.appendChild(urgent);

            var buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";
            var button = document.createElement("button");
            button.innerHTML = "update";
            button.setAttribute("data-toggle", "modal");
            button.setAttribute("data-target", "#myModal");
            button.setAttribute("onclick","set_values_for_update("+data.tasks[i].id+",\""+data.tasks[i].description+"\","+data.tasks[i].urgent+");")
            buttonDiv.appendChild(button);
            tr.appendChild(buttonDiv);


            var buttonDeleteDiv = document.createElement("div");
            buttonDeleteDiv.className = "button-container";
            var deleteButton = document.createElement("button");
            deleteButton.innerHTML = "delete";
            deleteButton.setAttribute("onclick","delete_task("+data.tasks[i].id+");")
            buttonDeleteDiv.appendChild(deleteButton);
            tr.appendChild(buttonDeleteDiv);
            tmpTable.append(tr);

        }

        // replace table with its (updated) clone
        table.replaceWith(tmpTable);
    });
}

function set_values_for_update(id,description, urgent)
{
    $("#task_id").val(id);
    $("#description").val(description);
    if (urgent === 1)
        $("#urgent").prop('checked', true);
    else
        $("#urgent").prop('checked',false);
}

function update_task()
{
    var id= $("#task_id").val();
    var description = $("#description").val();
    var urgent = ($("#urgent").is(':checked'))?1:0;
    $.ajax({
            url : '/api/v1.0/tasks/'+id,
            type : 'PUT',
            data : '{ "description": "' + description + '", "urgent": ' + urgent + ' }',
            contentType : 'application/json',
            success: function () {
                alert("Update was successfully executed");
                // reset the form
                document.getElementById("update-task").reset();
                // update the task list
                loadAndShowTasks();
            }
        });

}

function delete_task(id)
{
    $.ajax({
        url : '/api/v1.0/tasks/'+id,
        type : 'DELETE',
        contentType : 'application/json',
        success: function () {
            alert("Delete was successfully executed");
            // update the task list
            loadAndShowTasks();
        }
    });
}