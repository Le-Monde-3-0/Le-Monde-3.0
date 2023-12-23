FROM golang:1.19

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o admin .

EXPOSE 8081

CMD ["./admin"]