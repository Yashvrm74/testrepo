# Fibonacci series in Python
def fibonacci(n):
    sequence = []
    a, b = 0, 1
    while len(sequence) < n:
        sequence.append(a)
        a, b = b, a + b
    return sequence

if __name__ == "__main__":
    n = int(input("Enter the number of Fibonacci terms to display: "))
    print(f"Fibonacci series (first {n} terms):")
    print(fibonacci(n))
