export function LeapLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 666 145"
      fill="none"
      className={className}
      aria-label="Leap logo"
    >
      <path
        fill="currentColor"
        d="M85.852 115.579v28.895H0V0h28.617v115.579h57.235ZM222.069 115.579v28.895H107.601V0h114.468v28.895h-85.851V57.79h57.234v28.895h-57.234v28.894h85.851ZM272.436 28.895V0h57.234v28.895h-57.234Zm0 115.579h-28.618V28.894h28.618V57.79h57.234V28.895h28.617v115.579H329.67v-57.79h-57.234v57.79ZM408.653 144.474h-28.617V0h85.852v28.895h-57.235V57.79h57.235v28.895h-57.235v57.789Zm57.235-86.684V28.895h28.617V57.79h-28.617Z"
      />
      <path
        fill="url(#leap-gradient)"
        d="M598.359 76.703V8.406H666v68.297h-67.641ZM530.719 145V76.703h67.64V145h-67.64Z"
      />
      <defs>
        <linearGradient
          id="leap-gradient"
          x1="530.719"
          x2="667.306"
          y1="147.101"
          y2="11.826"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE87A" />
          <stop offset="0.5" stopColor="#D4DB00" />
          <stop offset="1" stopColor="#93C0FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
