<template>
  <footer class="p-4 bg-gray-200 dark:bg-gray-800 shadow-inner text-center">
    <div class="flex justify-center space-x-6 text-xl">
			<a href="https://jcesar206.github.io/myPersonalBlog/" target="_blank" class="hover:text-blue-400">
				<HomeIcon size="20"></HomeIcon>
			</a>
      <a href="https://github.com/JCesar206" target="_blank" class="hover:text-blue-400">
        <Github size="20" />
      </a>
      <a href="https://www.linkedin.com/in/jcesar206" target="_blank" class="hover:text-blue-400">
        <Linkedin size="20"/>
      </a>
      <a href="mailto:jcesar206@hotmail.com" class="hover:text-blue-400">
        <Mail size="20"/>
      </a>
    </div>
		<div>
			<p class="text-sm hover:text-blue-400 font-semibold">&copy; 2025 Small Business App | JulyDevops. All right reserved.</p>
		</div>
		<div>
			<p class="text-sm hover:text-blue-400 font-semibold">Made with: Vue + Tailwind + Vite + MySQL</p>
		</div>
  </footer>
</template>

<script setup>
import { Github, Linkedin, Mail, HomeIcon } from "lucide-vue-next";
</script>