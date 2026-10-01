<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['project', 'assignee', 'creator']);

        if ($request->has('project_id') && $request->project_id) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('assigned_to') && $request->assigned_to) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $tasks = $query->orderBy('position', 'asc')->latest()->get();

        return response()->json([
            'tasks' => $tasks,
        ]);
    }

    public function getProjectTasks(Request $request, $projectId)
    {
        $request->merge(['project_id' => $projectId]);
        return $this->index($request);
    }

    public function storeProjectTask(Request $request, $projectId)
    {
        $request->merge(['project_id' => $projectId]);
        return $this->store($request);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:to-do,in_progress,review,done',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'position' => 'nullable|integer',
        ]);

        $maxPosition = Task::where('project_id', $validated['project_id'])
            ->where('status', $validated['status'] ?? 'to-do')
            ->max('position') ?? 0;

        $task = Task::create([
            'project_id' => $validated['project_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'to-do',
            'priority' => $validated['priority'] ?? 'medium',
            'due_date' => $validated['due_date'] ?? null,
            'assigned_to' => $validated['assigned_to'] ?? null,
            'created_by' => $request->user()->id,
            'position' => $validated['position'] ?? ($maxPosition + 1),
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task->load(['assignee', 'creator', 'project']),
        ], 201);
    }

    public function show($id)
    {
        $task = Task::with(['project', 'assignee', 'creator'])->findOrFail($id);

        return response()->json([
            'task' => $task,
        ]);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:to-do,in_progress,review,done',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'position' => 'nullable|integer',
        ]);

        $task->update($validated);

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task->load(['assignee', 'creator', 'project']),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:to-do,in_progress,review,done',
            'position' => 'nullable|integer',
        ]);

        $task->status = $validated['status'];
        if (isset($validated['position'])) {
            $task->position = $validated['position'];
        }
        $task->save();

        return response()->json([
            'message' => 'Task status updated successfully',
            'task' => $task->load(['assignee', 'creator', 'project']),
        ]);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ]);
    }
}
