FROM golang:1.19

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o model .

# TODO edit to the same port of the main
EXPOSE 80XX

CMD ["./model"]