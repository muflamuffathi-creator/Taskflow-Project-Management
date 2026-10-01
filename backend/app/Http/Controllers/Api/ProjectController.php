<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Project::with(['owner', 'members'])
            ->withCount([
                'tasks',
                'tasks as completed_tasks_count' => function ($q) {
                    $q->where('status', 'done');
                },
                'tasks as in_progress_tasks_count' => function ($q) {
                    $q->where('status', 'in_progress');
                },
                'tasks as review_tasks_count' => function ($q) {
                    $q->where('status', 'review');
                },
                'tasks as todo_tasks_count' => function ($q) {
                    $q->where('status', 'to-do');
                },
            ]);

        if ($user->role !== 'admin') {
            $query->where(function ($q) use ($user) {
                $q->where('owner_id', $user->id)
                  ->orWhereHas('members', function ($mq) use ($user) {
                      $mq->where('users.id', $user->id);
                  });
            });
        }

        $projects = $query->latest()->get();

        return response()->json([
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:planning,active,on_hold,completed',
            'due_date' => 'nullable|date',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
        ]);

        $code = 'PRJ-' . strtoupper(Str::random(4));

        $project = Project::create([
            'name' => $validated['name'],
            'code' => $code,
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'active',
            'owner_id' => $request->user()->id,
            'due_date' => $validated['due_date'] ?? null,
        ]);

        // Attach owner and selected members
        $membersToAttach = collect($validated['member_ids'] ?? [])->push($request->user()->id)->unique();
        $project->members()->sync($membersToAttach);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project->load(['owner', 'members']),
        ], 201);
    }

    public function show($id, Request $request)
    {
        $project = Project::with(['owner', 'members', 'tasks.assignee', 'tasks.creator'])
            ->withCount(['tasks'])
            ->findOrFail($id);

        return response()->json([
            'project' => $project,
        ]);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:planning,active,on_hold,completed',
            'due_date' => 'nullable|date',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
        ]);

        $project->update($request->only(['name', 'description', 'status', 'due_date']));

        if ($request->has('member_ids')) {
            $membersToAttach = collect($validated['member_ids'])->push($project->owner_id)->unique();
            $project->members()->sync($membersToAttach);
        }

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project->load(['owner', 'members']),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        if ($request->user()->role !== 'admin' && $project->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully',
        ]);
    }

    public function addMember(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_in_project' => 'nullable|string',
        ]);

        $project->members()->syncWithoutDetaching([
            $request->user_id => ['role_in_project' => $request->role_in_project ?? 'member']
        ]);

        return response()->json([
            'message' => 'Member added to project',
            'project' => $project->load('members'),
        ]);
    }
}
