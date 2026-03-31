import React, { useState } from 'react';
import { 
  Plus, 
  GripVertical, 
  MessageSquare, 
  User, 
  Clock, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-surface border-white/10 text-slate-300' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-accent-blue/10 border-blue-500/30 text-accent-blue' },
  { id: 'review', title: 'Review', color: 'bg-accent/10 border-accent/30 text-accent' },
  { id: 'done', title: 'Done', color: 'bg-accent-cyan/10 border-cyan-500/30 text-accent-cyan' }
];

const difficultyStyles = {
  small: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  medium: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  large: 'border-orange-500/30 text-orange-400 bg-orange-500/10',
  critical: 'border-red-500/30 text-red-400 bg-red-500/10'
};

export default function KanbanBoard({ 
  tasks, 
  onMoveTask, 
  onCreateTask, 
  canManage, 
  contributors,
  user,
  onPick,
  onSubmitPR
}) {
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedTaskId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onMoveTask(taskId, columnId);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar">
        {COLUMNS.map(column => (
          <div 
            key={column.id}
            className={`flex-1 min-w-[280px] flex flex-col glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-glass ${column.id === 'todo' ? 'bg-surface/30' : 'bg-surface/50'}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-bg/50 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className={`font-bold uppercase text-xs tracking-[0.2em] ${column.id === 'todo' ? 'text-slate-300' : column.id === 'in_progress' ? 'text-accent-blue' : column.id === 'review' ? 'text-accent' : 'text-accent-cyan'}`}>
                  {column.title}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${column.color}`}>
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              {column.id === 'todo' && canManage && (
                <button 
                  onClick={onCreateTask}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/20 text-slate-400 hover:text-white"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            {/* Tasks List */}
            <div className="p-4 flex flex-col gap-4 min-h-[440px]">
              {tasks.filter(t => t.status === column.id).map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  draggable={canManage || task.assignedTo?._id === user?._id}
                  user={user}
                  onPick={onPick}
                  onSubmitPR={onSubmitPR}
                  columnId={column.id}
                />
              ))}
              
              {tasks.filter(t => t.status === column.id).length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-12 opacity-40 select-none text-center grayscale">
                  <div className="w-16 h-16 rounded-full border border-white/20 border-dashed flex items-center justify-center mb-3 text-slate-500">
                    <Clock size={24} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Queue Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, onDragStart, onDragEnd, draggable, user, onPick, onSubmitPR, columnId }) {
  const [showPRInput, setShowPRInput] = useState(false);
  const [prLink, setPrLink] = useState('');

  const isAssigned = task.assignedTo?._id === user?._id;
  const canPick = task.status === 'todo' && !task.assignedTo && user?.userType === 'student';

  const cardBorderColor = columnId === 'todo' ? 'border-white/10' : 
                          columnId === 'in_progress' ? 'border-blue-500/30' : 
                          columnId === 'review' ? 'border-accent/30' : 'border-cyan-500/30';

  const cardBgColor = columnId === 'todo' ? 'bg-bg/50' : 
                      columnId === 'in_progress' ? 'bg-blue-500/5' : 
                      columnId === 'review' ? 'bg-accent/5' : 'bg-cyan-500/5';

  return (
    <div 
      draggable={draggable}
      onDragStart={(e) => onDragStart(e, task._id)}
      onDragEnd={onDragEnd}
      className={`group ${cardBgColor} border ${cardBorderColor} p-5 rounded-xl shadow-inner hover:shadow-glass hover:bg-surface/80 transition-all cursor-grab active:cursor-grabbing ${!draggable ? 'opacity-90' : ''}`}
    >
      <div className="flex justify-between items-start gap-2 mb-4">
        <div className={`px-2 py-1 border rounded bg-transparent text-[8px] font-bold uppercase tracking-widest ${difficultyStyles[task.difficulty || 'small']}`}>
          Level: {task.difficulty || 'small'}
        </div>
        {draggable && <GripVertical size={14} className="text-slate-500 group-hover:text-white transition-colors shrink-0" />}
      </div>

      <h4 className="font-bold text-sm text-white leading-tight mb-2 uppercase tracking-wide">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-xs text-slate-400 font-medium mb-5 line-clamp-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Dynamic Action Buttons */}
      <div className="mb-4">
        {canPick && (
          <button 
            onClick={() => onPick(task._id)}
            className="w-full py-2 bg-blue-500/10 border border-blue-500/30 text-accent-blue rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-sm"
          >
            Assign Protocol
          </button>
        )}

        {task.status === 'in_progress' && isAssigned && !showPRInput && (
          <button 
            onClick={() => setShowPRInput(true)}
            className="w-full py-2 bg-accent/10 border border-accent/30 text-accent rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-sm"
          >
            Initiate Review
          </button>
        )}

        {showPRInput && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 p-3 bg-surface/50 border border-white/10 rounded-xl mt-3">
            <input 
              type="url" 
              placeholder="Source Control URL..."
              className="w-full px-3 py-2 bg-bg border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 outline-none focus:border-accent transition-colors shadow-inner"
              value={prLink}
              onChange={(e) => setPrLink(e.target.value)}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => { onSubmitPR(task._id, prLink); setShowPRInput(false); }}
                className="flex-1 py-2 bg-accent/20 border border-accent/50 text-accent rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
              >
                Transmit
              </button>
              <button 
                onClick={() => setShowPRInput(false)}
                className="px-3 py-2 border border-white/10 text-slate-400 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={12}/>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mentor Feedback Sticky */}
      {task.mentorFeedback && (
        <div className="mb-4 p-3 bg-orange-500/10 border-l-2 border-orange-500 rounded-r-lg text-[10px] font-medium text-orange-200/80 italic shadow-inner">
          "{task.mentorFeedback}"
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
        <div className="flex -space-x-2">
          {task.assignedTo ? (
            <div className="relative group/avatar">
              <img 
                src={task.assignedTo.profilePicture || `https://ui-avatars.com/api/?name=${task.assignedTo.username}&background=050505&color=fff`} 
                className={`w-7 h-7 rounded-full border-2 border-bg bg-surface object-cover ${isAssigned ? 'ring-2 ring-accent-blue ring-offset-2 ring-offset-bg shadow-[0_0_10px_rgba(59,130,246,0.5)]' : ''}`}
                alt={task.assignedTo.username}
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-surface border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-glass">
                {isAssigned ? 'Current Node' : task.assignedTo.username}
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-surface/30 text-slate-500">
              <User size={12} />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {task.prLink && (
             <a 
              href={task.prLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 bg-accent-blue/10 border border-blue-500/30 rounded-lg text-accent-blue hover:bg-blue-500 hover:text-white transition-all shadow-sm"
             >
                <ExternalLink size={12} />
             </a>
          )}
          <div className="bg-surface/50 px-2 py-1 rounded-lg border border-white/5 flex items-center gap-1.5 shadow-inner">
            <MessageSquare size={12} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-400">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
