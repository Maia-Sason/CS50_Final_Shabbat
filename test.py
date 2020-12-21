import math

x = 123
y = (x%10) * 100
z = (x%100  - x%10)
w = int((x/100))
solution = w + y + z

print(y)

if solution < 0:
    answer = False

x = 1234567

logged = int(math.log10(x) + 1)

z = 0
for v in range(logged):
    e = x // 10 ** v % 10
    z = e * (10**(logged-v-1)) + z
    
    if x < 0:
        return False

    if z == x:
        return True


    