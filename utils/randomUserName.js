export default function randomUserName() {
  return `user${Math.random().toString(36).substring(2, 15)}`;
}
