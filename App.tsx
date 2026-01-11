
import React, { useState, useEffect } from 'react';
import { User, InductionSection, AuthState, MediaAttachment, MediaType, Role } from './types';
import { INITIAL_USERS, INITIAL_SECTIONS } from './constants';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  MessageCircle,
  ChevronRight,
  Loader2,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  FileText,
  Video,
  Presentation,
  Image as ImageIcon,
  Paperclip,
  Lock
} from 'lucide-react';
import { gemini } from './services/geminiService';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  XAxis, 
  YAxis,
  AreaChart,
  Area
} from 'recharts';

// --- Components ---

const Logo: React.FC<{ className?: string; light?: boolean }> = ({ className = '', light = false }) => (
  <div className={`flex flex-col leading-none font-black italic tracking-tighter ${className} ${light ? 'text-white' : 'text-slate-800'}`}>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl uppercase">Best Pacific</span>
      <span className={`text-[10px] not-italic font-bold tracking-normal uppercase opacity-70 ${light ? 'text-indigo-200' : 'text-slate-400'}`}>Sri Lanka</span>
    </div>
  </div>
);

const Button: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'white'; 
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', type = "button", disabled = false }) => {
  const base = "px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    white: "bg-white text-indigo-600 hover:shadow-lg shadow-md"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean }> = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const MediaIcon: React.FC<{ type: MediaType }> = ({ type }) => {
  switch (type) {
    case 'video': return <Video size={18} className="text-blue-500" />;
    case 'presentation': return <Presentation size={18} className="text-orange-500" />;
    case 'document': return <FileText size={18} className="text-red-500" />;
    case 'image': return <ImageIcon size={18} className="text-emerald-500" />;
    default: return <Paperclip size={18} className="text-slate-400" />;
  }
};

// --- Pages ---

const LoginPage: React.FC<{ onLogin: (email: string, pass: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-600 blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full p-4 relative z-10">
        <Card className="p-8 md:p-10 border-t-4 border-t-indigo-600">
          <div className="text-center mb-10">
            <Logo className="mb-6 justify-center" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to Best Pacific</h1>
            <p className="text-slate-500 text-sm">Official Employee Induction Portal</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="name@bestpacific.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-4 text-lg">Start Induction</Button>
          </form>
          
          {/* Demo Details Removed as Requested */}
        </Card>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ user: User; sections: InductionSection[] }> = ({ user, sections }) => {
  const [activeSection, setActiveSection] = useState<InductionSection | null>(null);
  const [aiResponse, setAiResponse] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskAi = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const ans = await gemini.answerQuestion(query, sections);
    setAiResponse(ans);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative rounded-[2rem] bg-slate-900 p-8 md:p-12 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/20 skew-x-12 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">
              Welcome to <br/><span className="text-indigo-500">Best Pacific</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 font-medium">
              Hello {user.name}, Welcome to Best Pacific Onboarding Portal.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" className="px-8 py-3">Explore Curriculum <ChevronRight size={18} /></Button>
            </div>
          </div>
          <div className="flex-shrink-0 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 h-fit md:min-w-[240px]">
            <div className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em] mb-4">Total Completion</div>
            <div className="text-6xl font-black mb-2 text-indigo-400">{user.progress}%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mb-4">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${user.progress}%` }}></div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Trophy size={12} className="text-yellow-500" /> Milestone 1 Reached
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <BookOpen size={24} className="text-indigo-600" /> Induction Modules
          </h3>
          
          <div className="grid gap-4">
            {sections.map((section) => (
              <Card 
                key={section.id} 
                noPadding 
                className={`group transition-all cursor-pointer ${activeSection?.id === section.id ? 'ring-2 ring-indigo-500' : 'hover:border-indigo-200'}`}
              >
                <div onClick={() => setActiveSection(section)} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                          {section.category}
                        </span>
                        {section.attachments.length > 0 && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <Paperclip size={10} /> {section.attachments.length} Resources
                          </span>
                        )}
                      </div>
                      <h4 className="text-xl font-black text-slate-800">{section.title}</h4>
                      {activeSection?.id === section.id ? (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                          <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">{section.content}</p>
                          {section.attachments.length > 0 && (
                            <div className="space-y-3 pt-6 border-t border-slate-100">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multimedia Resources</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {section.attachments.map(att => (
                                  <a 
                                    key={att.id} 
                                    href={att.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group/link"
                                  >
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><MediaIcon type={att.type} /></div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-bold text-slate-800 truncate">{att.name}</div>
                                      <div className="text-[10px] text-slate-400 uppercase font-black">{att.type}</div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300 group-hover/link:translate-x-1 transition-transform" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 line-clamp-1 mt-1">{section.content}</p>
                      )}
                    </div>
                    <Button variant="ghost" className="p-2 ml-4">
                      <ChevronRight size={20} className={`${activeSection?.id === section.id ? 'rotate-90' : ''} transition-transform`} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card noPadding className="border-none shadow-xl shadow-indigo-100 bg-indigo-600 text-white">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md"><MessageCircle size={24} /></div>
                <div>
                  <h3 className="font-bold text-lg">BPAI Assistant</h3>
                  <p className="text-xs text-indigo-100 opacity-70 italic">Powered by Gemini</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask about leave, safety..." 
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-4 pr-12 py-3 text-sm outline-none placeholder:text-indigo-200 focus:bg-white/20 transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button onClick={handleAskAi} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-indigo-600 p-2 rounded-lg"><Search size={16} /></button>
                </div>
                {aiResponse && <div className="bg-white/10 rounded-2xl p-4 text-sm border border-white/10 animate-in fade-in">{aiResponse}</div>}
              </div>
            </div>
          </Card>
          
          <Card className="bg-white border-slate-200">
            <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-[0.2em] mb-6 flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" /> Recent Updates
            </h3>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">New PPE guidelines uploaded</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">2 hours ago</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">Welcome Video refreshed</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">Yesterday</p>
                  </div>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC<{ 
  users: User[]; 
  sections: InductionSection[]; 
  onDeleteSection: (id: string) => void;
  onAddSection: (section: Partial<InductionSection>) => void;
  onDeleteUser: (id: string) => void;
  onAddUser: (user: Partial<User>) => void;
}> = ({ users, sections, onDeleteSection, onAddSection, onDeleteUser, onAddUser }) => {
  const [tab, setTab] = useState<'content' | 'users'>('content');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('USER');
  
  // Media states
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('document');
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);

  const handleAddAttachment = () => {
    if (mediaUrl && mediaName) {
      setAttachments([...attachments, { id: Math.random().toString(), url: mediaUrl, name: mediaName, type: mediaType }]);
      setMediaUrl('');
      setMediaName('');
    }
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle && newContent) {
      onAddSection({ title: newTitle, content: newContent, category: 'Company', attachments });
      setNewTitle('');
      setNewContent('');
      setAttachments([]);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName && newUserEmail && newUserPass) {
      onAddUser({ name: newUserName, email: newUserEmail, password: newUserPass, role: newUserRole, department: 'Operations' });
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPass('');
      setNewUserRole('USER');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Admin Console</h2>
          <p className="text-slate-500 text-sm">Control center for Best Pacific Induction System</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
          <button onClick={() => setTab('content')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'content' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Content Manager</button>
          <button onClick={() => setTab('users')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>User Directory</button>
        </div>
      </div>

      {tab === 'content' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <Card noPadding className="xl:col-span-2">
            <div className="p-6 border-b border-slate-100 font-black text-slate-800 uppercase tracking-widest text-[10px]">Active Curriculum</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resources</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sections.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-400">#{s.order}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">{s.title}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-1">
                          {s.attachments.map(a => <MediaIcon key={a.id} type={a.type} />)}
                          {s.attachments.length === 0 && <span className="text-slate-300 text-[10px] uppercase font-black tracking-tighter">No Media</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right"><Button variant="danger" onClick={() => onDeleteSection(s.id)} className="p-2"><Trash2 size={16} /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="bg-slate-900 text-white border-none shadow-2xl">
            <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2"><Plus size={20} className="text-indigo-400" /> New Module</h3>
            <form onSubmit={handleAddSection} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Module Title</label>
                <input type="text" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-indigo-400 focus:bg-white/20 transition-all" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Quality Standards" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Text Content</label>
                <textarea rows={4} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-indigo-400 focus:bg-white/20 transition-all resize-none" value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Detailed content..." required />
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl space-y-4 border border-white/10">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Add Multimedia Assets</h4>
                <div className="grid grid-cols-1 gap-3">
                  <input type="text" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" placeholder="Resource Name (e.g. Intro PPT)" value={mediaName} onChange={e => setMediaName(e.target.value)} />
                  <input type="text" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" placeholder="File URL (Image/Video/Doc)" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
                  <select className="bg-white/10 border-none rounded-lg px-3 py-2 text-xs outline-none text-white" value={mediaType} onChange={e => setMediaType(e.target.value as MediaType)}>
                    <option value="document">📄 Document / PDF</option>
                    <option value="presentation">📊 Presentation (PPT)</option>
                    <option value="video">🎬 Video</option>
                    <option value="image">🖼️ Image</option>
                  </select>
                  <Button variant="ghost" className="bg-white/10 text-white text-xs w-full py-2 hover:bg-white/20" onClick={handleAddAttachment}>+ Add Attachment</Button>
                </div>
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {attachments.map(a => <div key={a.id} className="px-2 py-1 bg-white/10 rounded-md text-[9px] font-black flex items-center gap-1 uppercase tracking-tighter"><MediaIcon type={a.type} /> {a.name}</div>)}
                  </div>
                )}
              </div>
              
              <Button type="submit" variant="white" className="w-full py-4 uppercase font-black text-sm tracking-widest">Publish Induction Module</Button>
            </form>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <Card noPadding className="xl:col-span-2">
             <div className="p-6 border-b border-slate-100 font-black text-slate-800 uppercase tracking-widest text-[10px]">Employees & Staff</div>
             <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key (Pass)</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800 leading-none mb-1">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{u.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6"><span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-600 font-mono">{u.password || '••••••'}</span></td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden"><div className="bg-indigo-600 h-full" style={{width: `${u.progress}%`}} /></div>
                          <span className="text-[10px] font-black text-slate-400">{u.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button variant="danger" disabled={u.role === 'ADMIN' && users.filter(usr => usr.role === 'ADMIN').length <= 1} onClick={() => onDeleteUser(u.id)} className="p-2 inline-flex"><Trash2 size={16} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
          </Card>
          
          <Card className="shadow-xl border-2 border-slate-100 h-fit">
            <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2"><Plus size={20} className="text-indigo-600" /> New Staff</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Amali Silva" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="a.silva@bestpacific.com" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Password</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" value={newUserPass} onChange={e => setNewUserPass(e.target.value)} placeholder="Welcome123" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={newUserRole} onChange={e => setNewUserRole(e.target.value as Role)}>
                  <option value="USER">Normal User</option>
                  <option value="ADMIN">Admin User</option>
                </select>
              </div>
              <Button type="submit" className="w-full py-4 uppercase font-black tracking-widest text-sm">Create Employee Account</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [view, setView] = useState<'dashboard' | 'admin'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [sections, setSections] = useState<InductionSection[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedUsers = localStorage.getItem('bp_users_v2');
    const savedSections = localStorage.getItem('bp_sections_v2');
    setUsers(savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS);
    setSections(savedSections ? JSON.parse(savedSections) : INITIAL_SECTIONS);
  }, []);

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('bp_users_v2', JSON.stringify(users));
    if (sections.length > 0) localStorage.setItem('bp_sections_v2', JSON.stringify(sections));
  }, [users, sections]);

  const handleLogin = (email: string, pass: string) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (foundUser) {
      setAuth({ user: foundUser, isAuthenticated: true });
      setView(foundUser.role === 'ADMIN' ? 'admin' : 'dashboard');
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

  const handleLogout = () => setAuth({ user: null, isAuthenticated: false });

  const addSection = (section: Partial<InductionSection>) => {
    const newSection: InductionSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: section.title || 'Untitled',
      content: section.content || '',
      category: section.category || 'Company',
      lastUpdated: new Date().toISOString(),
      order: sections.length + 1,
      attachments: section.attachments || []
    };
    setSections([...sections, newSection]);
  };

  const deleteSection = (id: string) => setSections(sections.filter(s => s.id !== id));

  const addUser = (user: Partial<User>) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: user.name || 'Anonymous',
      email: user.email || '',
      password: user.password || 'password123',
      role: user.role || 'USER',
      department: user.department || 'Operations',
      joinDate: new Date().toISOString().split('T')[0],
      progress: 0
    };
    setUsers([...users, newUser]);
  };

  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  if (!auth.isAuthenticated || !auth.user) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className={`bg-slate-900 text-white transition-all duration-500 ease-in-out flex flex-col relative z-50 ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="p-8 flex items-center justify-between overflow-hidden whitespace-nowrap">
          {isSidebarOpen ? <Logo light /> : <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black italic">B</div>}
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={22} />
            {isSidebarOpen && <span className="font-bold tracking-tight">Induction Dashboard</span>}
          </button>
          {auth.user.role === 'ADMIN' && (
            <button onClick={() => setView('admin')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${view === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Settings size={22} />
              {isSidebarOpen && <span className="font-bold tracking-tight">Management Console</span>}
            </button>
          )}
        </nav>
        <div className="p-6 mt-auto border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-black text-indigo-400">
              {auth.user.name.split(' ').map(n => n[0]).join('')}
            </div>
            {isSidebarOpen && <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate leading-none mb-1">{auth.user.name}</p><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{auth.user.role}</p></div>}
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 mt-6 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all group overflow-hidden">
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-bold tracking-tight">Secure Log Out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <ChevronRight className={`transition-transform duration-500 ${isSidebarOpen ? 'rotate-180' : ''}`} size={20} />
            </button>
            <h2 className="font-black text-slate-800 tracking-tight text-lg uppercase hidden sm:block">Welcome to Best Pacific</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Lanka Operational
            </div>
            <Bell className="text-slate-400 cursor-pointer" size={20} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-20">
            {view === 'dashboard' ? <Dashboard user={auth.user} sections={sections} /> : <AdminPanel users={users} sections={sections} onDeleteSection={deleteSection} onAddSection={addSection} onDeleteUser={deleteUser} onAddUser={addUser} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
