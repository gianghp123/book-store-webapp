from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class RetrieveRequest(_message.Message):
    __slots__ = ("query", "dense_top_k", "sparse_top_k", "top_k")
    QUERY_FIELD_NUMBER: _ClassVar[int]
    DENSE_TOP_K_FIELD_NUMBER: _ClassVar[int]
    SPARSE_TOP_K_FIELD_NUMBER: _ClassVar[int]
    TOP_K_FIELD_NUMBER: _ClassVar[int]
    query: str
    dense_top_k: int
    sparse_top_k: int
    top_k: int
    def __init__(self, query: _Optional[str] = ..., dense_top_k: _Optional[int] = ..., sparse_top_k: _Optional[int] = ..., top_k: _Optional[int] = ...) -> None: ...

class RetrieveResponse(_message.Message):
    __slots__ = ("book_ids", "scores")
    BOOK_IDS_FIELD_NUMBER: _ClassVar[int]
    SCORES_FIELD_NUMBER: _ClassVar[int]
    book_ids: _containers.RepeatedScalarFieldContainer[str]
    scores: _containers.RepeatedScalarFieldContainer[float]
    def __init__(self, book_ids: _Optional[_Iterable[str]] = ..., scores: _Optional[_Iterable[float]] = ...) -> None: ...
