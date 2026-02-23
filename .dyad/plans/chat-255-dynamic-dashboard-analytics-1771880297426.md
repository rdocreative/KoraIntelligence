---
title: "Dynamic Dashboard Analytics"
summary: "Replace hardcoded dashboard widgets with dynamic analytics that reflect the user's actual habit data, including weekly evolution, priority breakdown, and day-of-week performance analysis."
chatId: "255"
createdAt: "2026-02-23T20:58:17.426Z"
updatedAt: "2026-02-23T20:58:17.426Z"
---

## Overview

Implement dynamic, data-driven analytics in the "Dashboard" tab of the Habits page. This will replace the current hardcoded mock data with real-time insights derived from the user's habit data.

## UI/UX Design

The dashboard will retain its modern, dark-themed aesthetic but will now display meaningful data:

1.  **Weekly Evolution Chart**:
    -   **Visual**: Area/Line chart showing completion rate over the last 7 days.
    -   **Interaction**: Tooltip showing exact completion numbers (e.g., "5/7 habits completed").
    
2.  **Habit Priority Distribution**:
    -   **Visual**: Donut chart showing the breakdown of habits by priority (Maximum, High, Medium, Normal).
    -   **Insight**: Helps users see if they are overloading themselves with high-priority tasks.

3.  **Day of Week Performance**:
    -   **Visual**: Bar chart ranking weekdays by productivity (e.g., "You are most productive on Tuesdays").
    -   **Insight**: Identifies weak days (e.g., "Fridays need more focus").

4.  **Top Performing Habits**:
    -   **Visual**: List of habits with the highest consistency/streaks.

## Technical Approach

### 1. Data Transformation (in `DashboardOverview.tsx`)
Create utility functions to process the `habits` array:
-   `getLast7DaysData(habits)`: Iterates through the last 7 days, checks which habits were scheduled (based on `weekDays`) and which were completed (based on `completedDates`).
-   `getPriorityDistribution(habits)`: Counts habits by `priority` level.
-   `getDayPerformance(habits)`: Aggregates historical completion rates by day of the week (0-6).

### 2. Component Updates
-   **`DashboardOverview.tsx`**:
    -   Update to accept `habits` prop.
    -   Replace hardcoded `DATA_EVOLUTION` and `DATA_DISTRIBUTION` with calculated values.
    -   Add new `DayPerformance` chart.
    -   Add dynamic "Insights" text based on data.

-   **`HabitsPage.tsx`**:
    -   Pass the local `habits` state to `DashboardOverview`.

## Implementation Steps

1.  **Modify `src/components/dashboard/DashboardOverview.tsx`**:
    -   Define `Habit` interface (matching the one in `HabitsPage`).
    -   Implement data processing logic (memoized with `useMemo`).
    -   Update `AreaChart` to use dynamic weekly data.
    -   Update `PieChart` to use dynamic priority data.
    -   Add a new "Day Performance" analysis section.

2.  **Update `src/pages/Habits.tsx`**:
    -   Update the usage of `<DashboardOverview />` to `<DashboardOverview habits={habits} />`.

3.  **Refine Visuals**:
    -   Ensure charts handle empty states gracefully (e.g., no habits created yet).
    -   Add tooltips explaining the metrics.

## Testing Strategy
-   Create habits with different schedules and completion histories.
-   Verify that the "Weekly Evolution" chart updates when a habit is toggled in the main list.
-   Verify that "Priority Distribution" changes when a habit's priority is edited.
