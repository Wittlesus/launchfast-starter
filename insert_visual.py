# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the insertion point - just before the closing </div></div></section> of hero
hero_end_pattern = '</div>\n</div>\n</section>\n\n<!-- What\'s Inside: Tech Stack Section -->'

if hero_end_pattern not in content:
    print("Could not find hero section end")
    exit(1)

visual_section = '''
<!-- Visual Proof: What's Included -->
<div class="mt-16 max-w-5xl mx-auto">
<div class="text-center mb-8">
<h2 class="text-2xl font-bold text-gray-900">See what you're getting</h2>
<p class="mt-2 text-sm text-gray-600">Pre-built pages, flows, and integrations ready to use</p>
</div>

<!-- Screenshot Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Auth Flow Preview -->
<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
<div class="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center mb-4 border border-gray-200">
<div class="text-center px-6">
<div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
<svg class="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
</div>
<div class="space-y-2">
<div class="h-2 w-32 bg-gray-200 rounded mx-auto"></div>
<div class="flex gap-2 justify-center">
<div class="h-10 w-24 bg-white border border-gray-300 rounded flex items-center justify-center text-xs font-medium">
<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
Google
</div>
<div class="h-10 w-24 bg-gray-900 text-white rounded flex items-center justify-center text-xs font-medium">
<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
GitHub
</div>
</div>
</div>
</div>
</div>
<h3 class="font-semibold text-gray-900 text-sm">Authentication Flow</h3>
<p class="text-xs text-gray-600 mt-1">Google & GitHub OAuth with NextAuth v5. Session management, protected routes, and sign-out.</p>
</div>

<!-- Stripe Checkout Preview -->
<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
<div class="aspect-video bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center mb-4 border border-gray-200">
<div class="text-center px-6 w-full max-w-xs">
<div class="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
<div class="flex items-center justify-between mb-3">
<span class="text-xs font-bold text-gray-900">Pro Plan</span>
<span class="text-lg font-bold text-gray-900">$29<span class="text-xs text-gray-500">/mo</span></span>
</div>
<div class="space-y-1 text-left mb-3">
<div class="flex items-center gap-2 text-xs text-gray-600">
<svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
Unlimited projects
</div>
<div class="flex items-center gap-2 text-xs text-gray-600">
<svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
Priority support
</div>
</div>
<div class="h-8 bg-indigo-600 text-white rounded text-xs font-semibold flex items-center justify-center">Subscribe with Stripe</div>
</div>
</div>
</div>
<h3 class="font-semibold text-gray-900 text-sm">Stripe Payments</h3>
<p class="text-xs text-gray-600 mt-1">Pre-built checkout, subscription management, billing portal, and webhooks.</p>
</div>

<!-- Dashboard Preview -->
<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
<div class="aspect-video bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg flex items-center justify-center mb-4 border border-gray-200 overflow-hidden">
<div class="w-full h-full p-3">
<div class="bg-white rounded border border-gray-200 h-full flex">
<!-- Sidebar -->
<div class="w-16 bg-gray-900 rounded-l flex flex-col items-center py-3 gap-2">
<div class="w-8 h-8 bg-gray-700 rounded"></div>
<div class="w-8 h-1 bg-gray-600 rounded mt-2"></div>
<div class="w-8 h-1 bg-gray-700 rounded"></div>
<div class="w-8 h-1 bg-gray-700 rounded"></div>
</div>
<!-- Main Area -->
<div class="flex-1 p-3">
<div class="h-3 w-24 bg-gray-200 rounded mb-3"></div>
<div class="grid grid-cols-3 gap-2 mb-2">
<div class="h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded border border-blue-200"></div>
<div class="h-12 bg-gradient-to-br from-green-50 to-green-100 rounded border border-green-200"></div>
<div class="h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded border border-purple-200"></div>
</div>
<div class="h-2 w-full bg-gray-100 rounded mb-1"></div>
<div class="h-2 w-3/4 bg-gray-100 rounded mb-1"></div>
<div class="h-2 w-5/6 bg-gray-100 rounded"></div>
</div>
</div>
</div>
</div>
<h3 class="font-semibold text-gray-900 text-sm">Dashboard UI</h3>
<p class="text-xs text-gray-600 mt-1">Clean sidebar navigation, responsive layout, user settings, and profile management.</p>
</div>

<!-- AI Integration Preview -->
<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
<div class="aspect-video bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center mb-4 border border-gray-200">
<div class="text-center px-6 w-full max-w-sm">
<div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-left">
<div class="flex items-start gap-2 mb-2">
<div class="w-6 h-6 bg-gray-900 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">AI</div>
<div class="flex-1">
<div class="h-2 w-full bg-gray-100 rounded mb-1"></div>
<div class="h-2 w-5/6 bg-gray-100 rounded mb-1"></div>
<div class="h-2 w-4/5 bg-gray-100 rounded"></div>
</div>
</div>
<div class="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
<div class="flex-1 h-7 bg-gray-50 border border-gray-200 rounded text-xs flex items-center px-2 text-gray-400">Ask anything...</div>
<div class="h-7 w-7 bg-gray-900 rounded flex items-center justify-center">
<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
</div>
</div>
</div>
</div>
</div>
<h3 class="font-semibold text-gray-900 text-sm">Claude AI Integration</h3>
<p class="text-xs text-gray-600 mt-1">Anthropic Claude API with streaming, rate limiting, and authentication.</p>
</div>
</div>

<!-- Trust Signal -->
<div class="mt-8 text-center">
<a href="https://github.com/Wittlesus/launchfast-starter" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" target="_blank" rel="noopener">
<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
<span>Browse the full source code on GitHub before you buy</span>
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
</a>
</div>
</div>

'''

# Replace the hero end with visual section + hero end
new_content = content.replace(hero_end_pattern, visual_section + '\n</div>\n</div>\n</section>\n\n<!-- What\'s Inside: Tech Stack Section -->')

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("[OK] Visual proof section added to hero")
