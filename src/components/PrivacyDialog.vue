<script setup>
defineProps({
  show: Boolean
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">bebo6 プライバシーポリシー</h2>
            
            <div class="prose prose-sm max-w-none space-y-4 overflow-y-auto max-h-[70vh]">
              <p>
                bebo6 (以下「本サービス」といいます。)を運営する株式会社EasyP (以下「当社」といいます。)は、ユーザーの個人情報を適切に管理し、その保護を確保するために、以下のとおりプライバシーポリシーを定めます。ユーザーは、本サービスを利用することで、本プライバシーポリシーに同意したものとみなします。
              </p>

              <h3 class="text-lg font-semibold">第1条 (個人情報の定義)</h3>
              <p>
                個人情報とは、権利を持つ個人に関連する情報であり、名前、電子メールアドレス、ログイン情報、IPアドレスなど、実名、身分が特定される情報を持つものを言います。
              </p>
              <p>
                本サービスは、ユーザーから収集した個人情報を、このポリシーに基づいて取り扱います。
              </p>

              <h3 class="text-lg font-semibold">第2条 (収集する個人情報)</h3>
              <p>当社は、下記の個人情報を収集します。</p>
              <ul class="list-disc pl-5">
                <li>メールアドレス、パスワード：アカウント登録およびログインに必要な情報</li>
                <li>ログイン記録：ログイン日時、IPアドレス、使用端末情報</li>
                <li>ユーザーが本サービス内で保存したメモの内容</li>
              </ul>

              <h3 class="text-lg font-semibold">第3条 (個人情報の利用目的)</h3>
              <p>当社は、下記の目的で個人情報を利用します。</p>
              <ul class="list-disc pl-5">
                <li>本サービスの提供、運営、改善</li>
                <li>ユーザーサポートの提供と問い合わせへの応答</li>
                <li>必要に応じたサービスに関する通知やお知らせの送信</li>
                <li>法令上の義務に基づく対応</li>
              </ul>

              <h3 class="text-lg font-semibold">第4条 (個人情報の取り扱いおよび共有)</h3>
              <p>
                当社は、法令に基づく場合を除き、ユーザーの予めの同意を得ずに個人情報を第三者と共有しません。<br>
                当社は、本サービスの運営に必要なデータをSupabaseなどの外部サービスに保存します。Supabaseのプライバシーポリシーは
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700">
                  こちら
                </a>
                をご参照ください。
              </p>

              <h3 class="text-lg font-semibold">第5条 (個人情報の保存期間)</h3>
              <p>
                当社は、個人情報を、利用目的に必要な期間に限って保存します。個人情報の保存期間を過ぎた場合、安全に削除または正式に匿名化します。
              </p>

              <h3 class="text-lg font-semibold">第6条 (個人情報の保護対策)</h3>
              <p>
                当社は、個人情報を不正アクセス、不正攻撃から保護するための合理的なセキュリティ対策を履行します。ただし、その結果、一切の完全性を保証するものではありません。
              </p>

              <h3 class="text-lg font-semibold">第7条 (問い合わせ先)</h3>
              <p>個人情報の取り扱いに関する問い合わせは以下の連絡先までお問い合わせください。</p>
              <p class="mt-2">
                株式会社EasyP<br>
                東京都渋谷区神宮前六丁目２３番４号　桑野ビル２階<br>
                info@easyp.cc
              </p>

              <div class="mt-6">
                <p class="font-semibold">附則</p>
                <p>本ポリシーは、2024年12月13日より適用されます。</p>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button
                @click="$emit('close')"
                class="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>