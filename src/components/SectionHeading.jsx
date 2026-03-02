export default function SectionHeading({ subtitle, title, description, light = false }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16 relative">
      {/* Decorative elements behind heading */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-highlight-yellow opacity-50 rounded-full blur-xl -z-10"></div>
      
      {subtitle && (
        <span className="inline-block px-3 py-1 bg-white border-2 border-primary shadow-neo-sm text-primary text-xs font-bold uppercase tracking-widest mb-4 transform -rotate-2">
          {subtitle}
        </span>
      )}
      <h2 className={`font-heading text-5xl md:text-6xl lg:text-7xl font-black mb-6 uppercase tracking-tight leading-none ${light ? 'text-white' : 'text-primary'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed ${light ? 'text-gray-300' : 'text-gray-700'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
