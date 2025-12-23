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
            <h2 class="text-xl font-bold mb-4">bebo6 利用規約</h2>
            
            <div class="prose prose-sm max-w-none space-y-4 overflow-y-auto max-h-[70vh]">
              <p>
                この利用規約は（以下「本規約」といいます。）bebo6 (以下「本サービス」といいます。)を運営する株式会社EasyPによって提供されるサービスの利用条件を定めるものです。登録ユーザー（以下「ユーザー」といいます。）は、本規約に同意した上で、本サービスを利用するものとします。
              </p>

              <h3 class="text-lg font-semibold">第1条（適用）</h3>
              <p>
                本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。<br>
                当社は本サービスに関し、本規約のほか、利用に関するルール等（以下「個別規定」といいます。）を定めることがあります。これら個別規定は本規約の一部を構成します。
              </p>

              <h3 class="text-lg font-semibold">第2条（サービス内容）</h3>
              <p>
                本サービスは、チャット形式のメモを記録・管理するためのPWA（Progressive Web App）形式のウェブアプリケーションです。<br>
                本サービスは、インターネットを通じてサーバー上にデータを保存し、複数の端末から同一環境にアクセスできることを特徴とします。<br>
                本サービスは現時点で無料で提供されますが、将来的に機能の追加や有料化を検討する可能性があります。
              </p>

              <h3 class="text-lg font-semibold">第3条（アカウントの作成と管理）</h3>
              <p>
                ユーザーは、本サービスを利用するために、メールアドレスおよびパスワードを用いてアカウントを作成する必要があります。<br>
                ユーザーは、自身のアカウント情報を適切に管理する責任を負います。<br>
                アカウントの不正使用、第三者への譲渡・貸与は禁じられます。<br>
                ユーザーは、アカウントの削除をアプリ上で行うことで、本サービスを退会することができます。
              </p>

              <h3 class="text-lg font-semibold">第4条（禁止行為）</h3>
              <ul class="list-disc pl-5">
                <li>法令または公平良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>他のユーザーまたは第三者の権利を侵害する行為</li>
                <li>本サービスを通じて不適切なコンテンツを投稿・送信する行為</li>
                <li>当社のサーバーやネットワークの機能に不平穏な負荷をかける行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>

              <h3 class="text-lg font-semibold">第5条（コンテンツの権利）</h3>
              <p>
                本サービスに保存されたデータは、ユーザー自身が権利を保持します。当社は、データの内容を無断で閲覧・利用することはありません。<br>
                本サービスを通じて保存されたデータが第三者の権利を侵害する場合、その責任はユーザー自身が負うものとします。
              </p>

              <h3 class="text-lg font-semibold">第6条（個人情報の取り扱い）</h3>
              <p>
                当社は、ユーザーの個人情報を適切に管理し、プライバシーポリシーに従って取り扱います。<br>
                本サービスは、データの保存および管理のために外部サービス（例：Supabase）を利用しています。このため、ユーザーのデータは該外部サービスに保存され、外部サービスの運営者の規約やポリシーが適用される場合があります。
              </p>

              <h3 class="text-lg font-semibold">第7条（責任の限定）</h3>
              <p>
                当社は、本サービスの提供にあたり、その完全性、正確性、有用性についていかなる保証も行いません。<br>
                本サービスの利用に関連してユーザーに生じた損害について、当社は一切の責任を負いません。ただし、法律により責任が免除されない場合を除きます。
              </p>

              <h3 class="text-lg font-semibold">第8条（契約解除およびアカウント停止）</h3>
              <p>
                ユーザーが本規約に違反した場合、当社はアカウントの停止または削除を行うことができます。<br>
                ユーザーがアカウントを削除した場合、当社は関連する全データを削除します。ただし、削除されたデータは復元できません。
              </p>

              <h3 class="text-lg font-semibold">第9条（サービス内容の変更および終了）</h3>
              <p>
                当社は、ユーザーに事前通知することなく、本サービスの内容を変更、追加または終了することがあります。<br>
                サービス終了の際は、ユーザーに合理的な期間をもって通知します。
              </p>

              <h3 class="text-lg font-semibold">第10条（準拠法および管轄裁判所）</h3>
              <p>
                本規約の解釈および適用に関しては、日本法を準拠法とします。<br>
                本サービスに関する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>

              <div class="mt-6">
                <p class="font-semibold">附則</p>
                <p>本規約は、2024年12月13日より適用されます。</p>
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