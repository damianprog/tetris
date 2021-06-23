export function drawBlock(ctx, position) {
  const blockSize = 20;

  ctx.fillStyle = '#000';
  ctx.fillRect(position.x, position.y, blockSize, blockSize);
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(
    position.x + 0.5,
    position.y + 0.5,
    blockSize - 1,
    blockSize - 1
  );
}
