FROM golang:1.19

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o articles .

EXPOSE 8082

CMD ["./articles"]