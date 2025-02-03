import React, { useState, useEffect, useRef } from 'react';
import { Home, Info, Command, Phone, BookOpen, BookKey, FileCode, Binary, FlaskConical, Book, User, Dot, ExternalLink, Mail, Cat, ChevronUp, ChevronDown, CornerDownLeft, X, AlignLeft, Search } from 'lucide-react';
import "./CommandMenu.css";

const ICONS = {
  home: Home,
  about: Info,
  contact: Phone,
  command: Command,
  blog: BookOpen,
  docs: BookKey,
  api: Binary,
  examples: FileCode,
  flaskConical: FlaskConical,
  book: Book,
  user: User,
  dot: Dot,
  externalLink: ExternalLink,
  mail: Mail,
  cat: Cat,
  up: ChevronUp,
  down: ChevronDown,
  enter: CornerDownLeft,
  close: X,
  alignLeft: AlignLeft,
  search: Search
};

const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  const navigationItems = [
    {
      group: "Pages",
      items: [
        { title: "Home", href: "/", icon: "home" },
        { title: "About", href: "/about", icon: "user" },
        { title: "Notes", href: "/notes", icon: "blog" },
        { title: "Readings", href: "/readings", icon: "book" },
        { title: "Colophon", href: "/colophon", icon: "about" },
        { title: "My Girls", href: "/my-girls", icon: "cat" },
      ]
    },
    {
      group: "Portfolio",
      items: [
        { title: "Recent Works", href: "/works", icon: "user" },
        { title: "Labs", href: "/labs", icon: "flaskConical" },
      ]
    },
    // {
    //   group: "Contact",
    //   items: [
    //     { 
    //       title: "X", 
    //       href: "https://x.com/frrrnd", 
    //       icon: "externalLink", 
    //       target: "_blank" 
    //     },
    //     { 
    //       title: "Are.na", 
    //       href: "https://www.are.na/fer-nshpf_to31q/channels", 
    //       icon: "externalLink",
    //       target: "_blank"
    //     },
    //     { 
    //       title: "Linkedin", 
    //       href: "https://linkedin/in/frrrnd", 
    //       icon: "user",
    //       target: "_blank"
    //     },
    //     { 
    //       title: "Mail", 
    //       href: "mailto:dotfernando@gmail.com", 
    //       icon: "mail",
    //       target: "_blank"
    //     }
    //   ]
    // }
  ];

  const filteredItems = navigationItems.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const flatItems = filteredItems.reduce((acc, group) => {
    return [...acc, ...group.items];
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
    setHoverIndex(null);
  }, [searchTerm]);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      
      if (!open) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < flatItems.length - 1 ? prev + 1 : 0
          );
          setHoverIndex(null);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : flatItems.length - 1
          );
          setHoverIndex(null);
          break;
        case 'Enter':
          e.preventDefault();
          if (flatItems[selectedIndex]) {
            const item = flatItems[selectedIndex];
            if (item.target === '_blank') {
              window.open(item.href, '_blank', 'noopener,noreferrer');
            } else {
              window.location.href = item.href;
            }
            setOpen(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
      }
    };

    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add("opened-menu");
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove("opened-menu");;
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, selectedIndex, flatItems]);

  useEffect(() => {
    const selectedElement = document.querySelector('[data-selected="true"]');
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const IconComponent = ({ name, className = "" }) => {
    const Icon = ICONS[name];
    return Icon ? <Icon className={`w-4 h-4 ${className}`} /> : null;
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="top-8 left-8 open-command"
        aria-label="Open command menu"
      >
        <IconComponent name="alignLeft" className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative command-wrapper">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm command-overlay"
        onClick={() => setOpen(false)}
      />
      
      <div className="inset-x-0 command-menu shadow-lg overflow-hidden">
        
        <div className="flex flex-col max-h-[80vh] command-inner">
          <div className="flex items-center justify-between p-4 command-header">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 close-command rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="px-4 pb-2">
            <div className="flex items-center search--wrapper rounded-lg px-3 py-3">
              <IconComponent name="search" className="mr-2" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search pages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-grow p-2">
            {filteredItems.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4">
                <div className="text-sm group-name mb-2 px-2">
                  {group.group}
                </div>
                <div>
                  {group.items.map((item, itemIndex) => {
                    const flatIndex = flatItems.findIndex(
                      flatItem => flatItem.href === item.href
                    );
                    
                    return (
                      <a
                        key={itemIndex}
                        href={item.href}
                        target={item.target}
                        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors 
                          ${selectedIndex === flatIndex ? 'item-selected' : ''} 
                          ${hoverIndex === flatIndex ? 'item-hover' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}
                        `}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => {
                          setHoverIndex(flatIndex);
                          setSelectedIndex(flatIndex);
                        }}
                        onMouseLeave={() => setHoverIndex(null)}
                        data-selected={selectedIndex === flatIndex}
                      >
                        <IconComponent name={item.icon} className="menu-icon" />
                        {item.title}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}

            {flatItems.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No pages found
              </div>
            )}
          </div>
        </div>
        
        <div className="command-footer">
          <div className="command-footer--left">
            <div className="icon--legend">
              <IconComponent name="up" />
              <p>Up</p>
            </div>

            <div className="icon--legend">
              <IconComponent name="down" />
              <p>Down</p>
            </div>
          </div>

          <div className="command-footer--right">
            <div className="icon--legend">
              <IconComponent name="enter" />
              <p>Enter page</p>
            </div>

            <div className="icon--legend">
              <small>ESC</small>
              <p>Close</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommandMenu;