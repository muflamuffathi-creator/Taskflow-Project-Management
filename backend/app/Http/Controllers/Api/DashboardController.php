<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function adminDashboard(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Admin authorization required.'], 403);
        }

        $totalProjects = Project::count();
        $activeProjects = Project::where('status', 'active')->count();

        $totalTasks = Task::count();
        $tasksByStatus = [
            'to_do' => Task::where('status', 'to-do')->count(),
            'in_progress' => Task::where('status', 'in_progress')->count(),
            'review' => Task::where('status', 'review')->count(),
            'done' => Task::where('status', 'done')->count(),
        ];

        $tasksByPriority = [
            'urgent' => Task::where('priority', 'urgent')->count(),
            'high' => Task::where('priority', 'high')->count(),
            'medium' => Task::where('priority', 'medium')->count(),
            'low' => Task::where('priority', 'low')->count(),
        ];

        $totalUsers = User::count();
        $membersCount = User::where('role', 'member')->count();

        // Team workload: users with assigned task counts
        $teamWorkload = User::withCount([
            'assignedTasks',
            'assignedTasks as completed_tasks_count' => function ($q) {
                $q->where('status', 'done');
            },
            'assignedTasks as pending_tasks_count' => function ($q) {
                $q->where('status', '!=', 'done');
            }
        ])->get();

        $recentTasks = Task::with(['project', 'assignee'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_projects' => $totalProjects,
                'active_projects' => $activeProjects,
                'total_tasks' => $totalTasks,
                'tasks_by_status' => $tasksByStatus,
                'tasks_by_priority' => $tasksByPriority,
                'total_users' => $totalUsers,
                'members_count' => $membersCount,
            ],
            'team_workload' => $teamWorkload,
            'recent_tasks' => $recentTasks,
        ]);
    }

    public function memberDashboard(Request $request)
    {
        $user = $request->user();

        // Member's assigned tasks
        $assignedTasksQuery = Task::where('assigned_to', $user->id);

        $totalAssigned = (clone $assignedTasksQuery)->count();
        $completedTasks = (clone $assignedTasksQuery)->where('status', 'done')->count();
        $inProgressTasks = (clone $assignedTasksQuery)->where('status', 'in_progress')->count();
        $reviewTasks = (clone $assignedTasksQuery)->where('status', 'review')->count();
        $todoTasks = (clone $assignedTasksQuery)->where('status', 'to-do')->count();

        $overdueTasks = (clone $assignedTasksQuery)
            ->where('due_date', '<', Carbon::today())
            ->where('status', '!=', 'done')
            ->with(['project'])
            ->get();

        $upcomingTasks = (clone $assignedTasksQuery)
            ->where('due_date', '>=', Carbon::today())
            ->where('due_date', '<=', Carbon::today()->addDays(7))
            ->where('status', '!=', 'done')
            ->with(['project'])
            ->orderBy('due_date', 'asc')
            ->get();

        $myProjects = Project::where('owner_id', $user->id)
            ->orWhereHas('members', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            })
            ->withCount(['tasks'])
            ->get();

        return response()->json([
            'stats' => [
                'total_assigned' => $totalAssigned,
                'completed' => $completedTasks,
                'in_progress' => $inProgressTasks,
                'review' => $reviewTasks,
                'to_do' => $todoTasks,
                'overdue_count' => $overdueTasks->count(),
            ],
            'overdue_tasks' => $overdueTasks,
            'upcoming_tasks' => $upcomingTasks,
            'my_projects' => $myProjects,
        ]);
    }
}
