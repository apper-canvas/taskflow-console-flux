class TaskServiceClass {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "project_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
{"field": {"Name": "order_c"}},
          {"field": {"Name": "category_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Map database fields to application format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        projectId: task.project_id_c,
        priority: task.priority_c,
        status: task.status_c,
        dueDate: task.due_date_c,
        createdAt: task.created_at_c,
        completedAt: task.completed_at_c,
order: task.order_c,
        category: task.category_c || ""
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "project_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
{"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "category_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error("Task not found");
      }
      
      // Map database fields to application format
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        projectId: task.project_id_c,
        priority: task.priority_c,
        status: task.status_c,
        dueDate: task.due_date_c,
        createdAt: task.created_at_c,
        completedAt: task.completed_at_c,
order: task.order_c,
        category: task.category_c || ""
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      // Only include Updateable fields as per field visibility
      const params = {
        records: [{
          title_c: taskData.title,
          description_c: taskData.description,
          project_id_c: taskData.projectId ? parseInt(taskData.projectId) : null,
          priority_c: taskData.priority,
          status_c: taskData.status,
          due_date_c: taskData.dueDate,
          created_at_c: taskData.createdAt,
          completed_at_c: taskData.completedAt,
order_c: taskData.order ? parseInt(taskData.order) : 0,
          category_c: taskData.category || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          // Map database fields to application format
          const createdTask = successful[0].data;
          return {
            Id: createdTask.Id,
            title: createdTask.title_c,
            description: createdTask.description_c,
            projectId: createdTask.project_id_c,
            priority: createdTask.priority_c,
status: createdTask.status_c,
            dueDate: createdTask.due_date_c,
            category: createdTask.category_c || "",
            createdAt: createdTask.created_at_c,
            completedAt: createdTask.completed_at_c,
            order: createdTask.order_c
          };
        }
      }
      
      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      // Only include Updateable fields as per field visibility
      const updateFields = {};
      
      if (updateData.title !== undefined) updateFields.title_c = updateData.title;
      if (updateData.description !== undefined) updateFields.description_c = updateData.description;
      if (updateData.projectId !== undefined) updateFields.project_id_c = updateData.projectId ? parseInt(updateData.projectId) : null;
      if (updateData.priority !== undefined) updateFields.priority_c = updateData.priority;
      if (updateData.status !== undefined) updateFields.status_c = updateData.status;
if (updateData.dueDate !== undefined) updateFields.due_date_c = updateData.dueDate;
      if (updateData.completedAt !== undefined) updateFields.completed_at_c = updateData.completedAt;
      if (updateData.category !== undefined) updateFields.category_c = updateData.category;
      if (updateData.order !== undefined) updateFields.order_c = updateData.order ? parseInt(updateData.order) : 0;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          // Map database fields to application format
          const updatedTask = successful[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c,
            description: updatedTask.description_c,
            projectId: updatedTask.project_id_c,
priority: updatedTask.priority_c,
            status: updatedTask.status_c,
            category: updatedTask.category_c || "",
            dueDate: updatedTask.due_date_c,
            createdAt: updatedTask.created_at_c,
            completedAt: updatedTask.completed_at_c,
            order: updatedTask.order_c
          };
        }
      }
      
      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const TaskService = new TaskServiceClass();