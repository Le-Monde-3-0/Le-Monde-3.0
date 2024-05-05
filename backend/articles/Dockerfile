FROM golang:1.20

WORKDIR /app

COPY . .

RUN go mod download

RUN go build . 

EXPOSE 8082

CMD ["./main"]