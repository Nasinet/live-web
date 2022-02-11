// /* eslint-disable */
export default (id) => ({"anchorid":63621150,"liveid":id,"title":"真的好想你啊","thumb":"https://live-1300631461.cos.ap-shanghai.myqcloud.com/images/2020060317060970427END%2817593%29.jpg","isvideo":1,"stream":null,"pull_url":"https://live-1300631461.cos.ap-shanghai.myqcloud.com/images/2020060317060970427END%2817593%29.jpg","categoryid":5,"orientation":1,"start_stamp":1591175182,"end_stamp":null,"start_time":"2020-06-03 17:06:22","end_time":null,"hot":30,"rec_weight":0,"anchor":{"id":63621150,"nick_name":"酸酸甜甜","user_level":1,"avatar":"https://meet1v1-1300631461.cos.ap-shanghai.myqcloud.com/images/2020010317370466214timg.jpg","profile":{"uid":63621150,"age":22,"gender":0,"career":null,"height":0,"weight":0,"city":"","birthday":"","constellation":"","signature":"kjdhjs家还是多久啊"}}})

var reorganizeString = function(S) {
  const hash = {}
  let max = ''
  for (let i = 0, len = S.length; i < len; i++) {
    if (!hash[S[i]]) {
      hash[S[i]] = 1
    } else {
      hash[S[i]]++
    }
    if (hash[S[i]] > max) {
      max = S[i]
    }
  }
  if (hash[max] - 1 === S.length - hash[max]) {
    let res = ''

  }
}

var findClosest = function(words, word1, word2) {
  let preIndex = 0
  let current = ''
  let res = words.length
  for (let i = 0, len = words.length; i < len; i++) {
    if (words[i] === word1 || words[i] === word2) {
      if (words[i] !== current && current) {
        if (res > i - preIndex) {
          res = i - preIndex
        }
      }
      current = words[i]
      preIndex = i
    }
  }
  return res
};


/**
 * 413
 * @param A{number[]}
 * @return {number}
 */
var numberOfArithmeticSlices = function(A) {
  if (A.length <= 2) return 0
  let preIndex = 0
  let current = A[1] - A[0]
  let res = 0
  for (let i = 1, len = A.length; i < len; i++) {
    const dis = A[i] - A[i - 1]
    if (dis === current) {
      if (i - preIndex >= 2) {
        res += (i - preIndex - 1)
      }
    } else {
      current = dis
      preIndex = i - 1
    }
  }
  return res
};

/**
 * @param {string} astr
 * @return {boolean}
 */
var isUnique = function(astr) {
  for (let i = 0, len = astr.length; i < len; i++) {
    if (astr.indexOf(astr[i]) !== i) {
      return false
    }
  }
  return true
}


/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @param {number} total
 * @param {ListNode[]} list
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n, total= 0, list= []) {
  if (!head) return head
  total++
  list.push(head)
  if (head.next) {
    removeNthFromEnd(head.next, n, total, list)
  } else {
    if (n === 1) {
      if (list[total - n - 1]) {
        list[total - n - 1].next = null
      }
    }
    list[total - n].next = list[total - n + 1].next
    list[total - n].val = list[total - n + 1].val
  }
  return head
};

/**
 * @param {number[]} arr
 * @return {number}
 */
var numOfSubarrays = function(arr) {
  let res = 0
  let preIndex = 0
  let count = 0
  let len = arr.length
  for (let i = 0; i < len; i++) {

  }
  return res
};
